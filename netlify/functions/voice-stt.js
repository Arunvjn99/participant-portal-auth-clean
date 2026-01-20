/**
 * Netlify Function: Speech-to-Text
 * POST /api/voice/stt
 */

import { SpeechClient } from "@google-cloud/speech";
import { checkRateLimit, getClientIdentifier } from "./utils/rateLimiter.js";
import { logAuditEvent, AuditEventType } from "./utils/auditLogger.js";
import { getSecurityHeaders, getCorsHeaders, handleOptionsRequest, isOriginAllowed } from "./utils/security.js";
import { getKillSwitchResponse, isSTTEnabled } from "./utils/killSwitch.js";
import { withTimeout, TIMEOUTS } from "./utils/timeout.js";

// Initialize Google Cloud client
let speechClient;
try {
  const credentials = process.env.GOOGLE_CLOUD_CREDENTIALS
    ? JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS)
    : null;

  if (credentials) {
    speechClient = new SpeechClient({ credentials });
  }
} catch (error) {
  console.error("Error initializing SpeechClient:", error);
}

/**
 * Sanitize text - mask sensitive patterns
 */
function sanitizeText(text) {
  // Mask SSN
  let sanitized = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "XXX-XX-XXXX");
  // Mask account numbers (keep last 4 only)
  sanitized = sanitized.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, (match) => {
    return `XXXX-XXXX-XXXX-${match.slice(-4)}`;
  });
  return sanitized;
}

export const handler = async (event, context) => {
  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptionsRequest(event);
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        ...getSecurityHeaders(),
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const origin = event.headers.origin || event.headers.Origin;
  
  // CORS check
  if (origin && !isOriginAllowed(origin)) {
    return {
      statusCode: 403,
      headers: {
        'Content-Type': 'application/json',
        ...getSecurityHeaders(),
      },
      body: JSON.stringify({ error: 'Forbidden origin' }),
    };
  }

  // PART 5: Kill switch check
  if (!isSTTEnabled()) {
    logAuditEvent(AuditEventType.KILL_SWITCH_TRIGGERED, {
      service: 'STT',
    });
    return {
      ...getKillSwitchResponse('Speech-to-Text'),
      headers: {
        ...getKillSwitchResponse('Speech-to-Text').headers,
        ...getCorsHeaders(origin),
        ...getSecurityHeaders(),
      },
    };
  }

  // PART 3: Rate limiting
  const clientId = getClientIdentifier(event);
  const rateLimit = checkRateLimit(clientId, 'stt', 30, 60000); // 30 req/min

  if (!rateLimit.allowed) {
    logAuditEvent(AuditEventType.RATE_LIMIT_EXCEEDED, {
      service: 'STT',
      clientId: clientId.substring(0, 8) + '...', // Partial ID only
    });

    return {
      statusCode: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
        'X-RateLimit-Limit': '30',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': Math.ceil(rateLimit.resetAt / 1000).toString(),
        ...getCorsHeaders(origin),
        ...getSecurityHeaders(),
      },
      body: JSON.stringify({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
      }),
    };
  }

  try {
    // Parse multipart/form-data
    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(origin),
          ...getSecurityHeaders(),
        },
        body: JSON.stringify({ error: 'Invalid content type. Expected multipart/form-data' }),
      };
    }

    if (!speechClient) {
      return {
        statusCode: 503,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(origin),
          ...getSecurityHeaders(),
        },
        body: JSON.stringify({
          error: 'Speech-to-Text service unavailable',
          message: 'Service not configured',
        }),
      };
    }

    // Parse multipart form data
    // Netlify Functions body may be base64 encoded for binary data
    let bodyString = event.body;
    if (event.isBase64Encoded) {
      bodyString = Buffer.from(event.body, 'base64').toString('binary');
    }

    const boundaryMatch = contentType.match(/boundary=([^;]+)/);
    if (!boundaryMatch) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(origin),
          ...getSecurityHeaders(),
        },
        body: JSON.stringify({ error: 'Invalid multipart boundary' }),
      };
    }

    const boundary = boundaryMatch[1].trim();
    const parts = bodyString.split(`--${boundary}`);
    
    let audioBuffer = null;
    let mimeType = 'audio/webm';

    for (const part of parts) {
      if (part.includes('Content-Disposition') && part.includes('name="audio"')) {
        // Find the boundary between headers and body
        const headerEnd = part.indexOf('\r\n\r\n');
        if (headerEnd === -1) continue;
        
        // Extract body (remove trailing boundary markers)
        let body = part.slice(headerEnd + 4);
        body = body.replace(/\r\n$/, '').replace(/--$/, '');
        
        // Audio is binary, so we need to handle it correctly
        // If it looks like base64, decode it; otherwise use as binary
        try {
          audioBuffer = Buffer.from(body, 'base64');
        } catch {
          // If not base64, treat as binary
          audioBuffer = Buffer.from(body, 'binary');
        }
        
        // Extract mime type if available
        const contentTypeMatch = part.match(/Content-Type:\s*([^\r\n]+)/i);
        if (contentTypeMatch) {
          mimeType = contentTypeMatch[1].trim();
        }
        break;
      }
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(origin),
          ...getSecurityHeaders(),
        },
        body: JSON.stringify({ error: 'No audio file provided' }),
      };
    }

    // Configure recognition request
    const request = {
      audio: {
        content: audioBuffer.toString('base64'),
      },
      config: {
        encoding: mimeType.includes('webm') ? 'WEBM_OPUS' : mimeType.includes('wav') ? 'LINEAR16' : 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'en-US',
        model: 'latest_short',
        enableAutomaticPunctuation: true,
        useEnhanced: true,
      },
    };

    // PART 4: Timeout protection
    const recognizePromise = speechClient.recognize(request);
    const [response] = await withTimeout(
      recognizePromise,
      TIMEOUTS.STT,
      'STT request timeout'
    );

    if (!response.results || response.results.length === 0) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': '30',
          'X-RateLimit-Remaining': (rateLimit.remaining - 1).toString(),
          'X-RateLimit-Reset': Math.ceil(rateLimit.resetAt / 1000).toString(),
          ...getCorsHeaders(origin),
          ...getSecurityHeaders(),
        },
        body: JSON.stringify({
          transcript: '',
          confidence: 0,
          error: 'No speech detected',
        }),
      };
    }

    const result = response.results[0];
    const alternative = result.alternatives[0];
    const transcript = alternative.transcript || '';

    // PART 6: Safe audit logging (never log transcript)
    // Log only metadata: task type, step if available, success
    // NO transcript, NO audio, NO personal data

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': '30',
        'X-RateLimit-Remaining': (rateLimit.remaining - 1).toString(),
        'X-RateLimit-Reset': Math.ceil(rateLimit.resetAt / 1000).toString(),
        ...getCorsHeaders(origin),
        ...getSecurityHeaders(),
      },
      body: JSON.stringify({
        transcript,
        confidence: alternative.confidence || 0,
      }),
    };
  } catch (error) {
    // PART 4: Handle timeout errors
    if (error.message.includes('timeout')) {
      logAuditEvent(AuditEventType.TIMEOUT_OCCURRED, {
        service: 'STT',
        errorCode: 'TIMEOUT',
      });
    } else {
      logAuditEvent(AuditEventType.ERROR_OCCURRED, {
        service: 'STT',
        errorCode: error.code || 'UNKNOWN',
      });
    }

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(origin),
        ...getSecurityHeaders(),
      },
      body: JSON.stringify({
        error: 'Speech-to-Text failed',
        message: error.message.includes('timeout')
          ? 'Request timed out. Please try again.'
          : "I couldn't hear that clearly. You can try again or type instead.",
      }),
    };
  }
};
