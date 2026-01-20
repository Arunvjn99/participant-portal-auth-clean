/**
 * Netlify Function: LLM Number Normalization
 * POST /api/llm/normalize
 */

import { checkRateLimit, getClientIdentifier } from "./utils/rateLimiter.js";
import { logAuditEvent, AuditEventType } from "./utils/auditLogger.js";
import { getSecurityHeaders, getCorsHeaders, handleOptionsRequest, isOriginAllowed } from "./utils/security.js";
import { getKillSwitchResponse, isLLMEnabled } from "./utils/killSwitch.js";
import { withTimeout, TIMEOUTS } from "./utils/timeout.js";

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
  if (!isLLMEnabled()) {
    logAuditEvent(AuditEventType.KILL_SWITCH_TRIGGERED, {
      service: 'LLM_NORMALIZE',
    });
    return {
      ...getKillSwitchResponse('LLM Normalization'),
      headers: {
        ...getKillSwitchResponse('LLM Normalization').headers,
        ...getCorsHeaders(origin),
        ...getSecurityHeaders(),
      },
    };
  }

  // PART 3: Rate limiting
  const clientId = getClientIdentifier(event);
  const rateLimit = checkRateLimit(clientId, 'llm', 20, 60000); // 20 req/min

  if (!rateLimit.allowed) {
    logAuditEvent(AuditEventType.RATE_LIMIT_EXCEEDED, {
      service: 'LLM_NORMALIZE',
      clientId: clientId.substring(0, 8) + '...',
    });

    return {
      statusCode: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
        'X-RateLimit-Limit': '20',
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
    const { task, text } = body;

    if (!text || typeof text !== 'string') {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(origin),
          ...getSecurityHeaders(),
        },
        body: JSON.stringify({ error: 'Invalid request body' }),
      };
    }

    // Mock LLM call (replace with actual LLM API)
    // For now, return null to use deterministic parsing
    const llmCall = new Promise((resolve) => {
      setTimeout(() => {
        // Mock: simple pattern matching
        const lowerText = text.toLowerCase();
        const patterns = {
          'twelve thousand': 12000,
          'ten thousand': 10000,
          'five thousand': 5000,
          'ten grand': 10000,
          'twelve grand': 12000,
        };

        let normalizedText = text;
        const numbers = [];

        for (const [phrase, value] of Object.entries(patterns)) {
          if (lowerText.includes(phrase)) {
            normalizedText = normalizedText.replace(new RegExp(phrase, 'gi'), value.toString());
            numbers.push({ original: phrase, value });
            break;
          }
        }

        resolve(numbers.length > 0 ? {
          normalizedText,
          numbers,
        } : null);
      }, 100);
    });

    // PART 4: Timeout protection
    const result = await withTimeout(
      llmCall,
      TIMEOUTS.LLM,
      'LLM request timeout'
    );

    if (!result) {
      // Fallback to original
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': (rateLimit.remaining - 1).toString(),
          'X-RateLimit-Reset': Math.ceil(rateLimit.resetAt / 1000).toString(),
          ...getCorsHeaders(origin),
          ...getSecurityHeaders(),
        },
        body: JSON.stringify({
          normalizedText: text,
          numbers: [],
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': '20',
        'X-RateLimit-Remaining': (rateLimit.remaining - 1).toString(),
        'X-RateLimit-Reset': Math.ceil(rateLimit.resetAt / 1000).toString(),
        ...getCorsHeaders(origin),
        ...getSecurityHeaders(),
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    // PART 4: Handle timeout errors
    if (error.message.includes('timeout')) {
      logAuditEvent(AuditEventType.TIMEOUT_OCCURRED, {
        service: 'LLM_NORMALIZE',
        errorCode: 'TIMEOUT',
      });
    } else {
      logAuditEvent(AuditEventType.ERROR_OCCURRED, {
        service: 'LLM_NORMALIZE',
        errorCode: error.code || 'UNKNOWN',
      });
    }

    // Fallback to original text on error
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(origin),
        ...getSecurityHeaders(),
      },
      body: JSON.stringify({
        normalizedText: JSON.parse(event.body || '{}').text || '',
        numbers: [],
      }),
    };
  }
};
