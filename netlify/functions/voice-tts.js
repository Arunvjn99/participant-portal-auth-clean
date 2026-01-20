/**
 * Netlify Function: Text-to-Speech
 * POST /api/voice/tts
 */

import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { checkRateLimit, getClientIdentifier } from "./utils/rateLimiter.js";
import { logAuditEvent, AuditEventType } from "./utils/auditLogger.js";
import { getSecurityHeaders, getCorsHeaders, handleOptionsRequest, isOriginAllowed } from "./utils/security.js";
import { getKillSwitchResponse, isTTSEnabled } from "./utils/killSwitch.js";
import { withTimeout, TIMEOUTS } from "./utils/timeout.js";

// Initialize Google Cloud client
let ttsClient;
try {
  const credentials = process.env.GOOGLE_CLOUD_CREDENTIALS
    ? JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS)
    : null;

  if (credentials) {
    ttsClient = new TextToSpeechClient({ credentials });
  }
} catch (error) {
  console.error("Error initializing TextToSpeechClient:", error);
}

/**
 * Sanitize text for TTS - mask sensitive data
 */
function sanitizeTextForTTS(text) {
  // Mask SSN patterns
  let sanitized = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "XXX-XX-XXXX");
  
  // Mask bank account numbers
  sanitized = sanitized.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, (match) => {
    return `XXXX-XXXX-XXXX-${match.slice(-4)}`;
  });

  // Mask routing numbers
  sanitized = sanitized.replace(/\b\d{9}\b/g, "XXXX-XXXX-X");

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
  if (!isTTSEnabled()) {
    logAuditEvent(AuditEventType.KILL_SWITCH_TRIGGERED, {
      service: 'TTS',
    });
    return {
      ...getKillSwitchResponse('Text-to-Speech'),
      headers: {
        ...getKillSwitchResponse('Text-to-Speech').headers,
        ...getCorsHeaders(origin),
        ...getSecurityHeaders(),
      },
    };
  }

  // PART 3: Rate limiting
  const clientId = getClientIdentifier(event);
  const rateLimit = checkRateLimit(clientId, 'tts', 30, 60000); // 30 req/min

  if (!rateLimit.allowed) {
    logAuditEvent(AuditEventType.RATE_LIMIT_EXCEEDED, {
      service: 'TTS',
      clientId: clientId.substring(0, 8) + '...',
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
    const body = JSON.parse(event.body || '{}');
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(origin),
          ...getSecurityHeaders(),
        },
        body: JSON.stringify({ error: 'No text provided' }),
      };
    }

    if (!ttsClient) {
      return {
        statusCode: 503,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(origin),
          ...getSecurityHeaders(),
        },
        body: JSON.stringify({
          error: 'Text-to-Speech service unavailable',
          message: 'Service not configured',
        }),
      };
    }

    // Sanitize text - never speak sensitive data
    const sanitizedText = sanitizeTextForTTS(text);

    // PART 3: Force female neural voice
    // Configure TTS request with modern female neural voice
    const request = {
      input: { text: sanitizedText },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Neural2-F', // Female neural voice
        ssmlGender: 'FEMALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0, // Natural speaking rate
        pitch: 0.0, // Default pitch
        volumeGainDb: 0,
      },
    };

    console.log('🔊 Using voice: en-US-Neural2-F');

    // PART 4: Timeout protection
    const synthesizePromise = ttsClient.synthesizeSpeech(request);
    const [response] = await withTimeout(
      synthesizePromise,
      TIMEOUTS.TTS,
      'TTS request timeout'
    );

    if (!response.audioContent) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(origin),
          ...getSecurityHeaders(),
        },
        body: JSON.stringify({
          error: 'Text-to-Speech failed',
          message: 'Could not generate audio',
        }),
      };
    }

    // PART 6: Safe audit logging (never log text content)
    // Log only: success, length metadata, never actual text

    const audioBuffer = Buffer.from(response.audioContent, 'base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'X-RateLimit-Limit': '30',
        'X-RateLimit-Remaining': (rateLimit.remaining - 1).toString(),
        'X-RateLimit-Reset': Math.ceil(rateLimit.resetAt / 1000).toString(),
        ...getCorsHeaders(origin),
        ...getSecurityHeaders(),
      },
      body: audioBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    // PART 4: Handle timeout errors
    if (error.message.includes('timeout')) {
      logAuditEvent(AuditEventType.TIMEOUT_OCCURRED, {
        service: 'TTS',
        errorCode: 'TIMEOUT',
      });
    } else {
      logAuditEvent(AuditEventType.ERROR_OCCURRED, {
        service: 'TTS',
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
        error: 'Text-to-Speech failed',
        message: error.message.includes('timeout')
          ? 'Request timed out. Please try again.'
          : 'Could not generate speech audio',
      }),
    };
  }
};
