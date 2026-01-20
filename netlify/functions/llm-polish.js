/**
 * Netlify Function: LLM Response Polish
 * POST /api/llm/polish
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
      service: 'LLM_POLISH',
    });
    return {
      ...getKillSwitchResponse('LLM Polish'),
      headers: {
        ...getKillSwitchResponse('LLM Polish').headers,
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
      service: 'LLM_POLISH',
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
    const { text, tone, constraints } = body;

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
    // For now, return original text
    const llmCall = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ polishedText: text }); // Mock: no polishing
      }, 100);
    });

    // PART 4: Timeout protection
    const result = await withTimeout(
      llmCall,
      TIMEOUTS.LLM,
      'LLM request timeout'
    );

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
        service: 'LLM_POLISH',
        errorCode: 'TIMEOUT',
      });
    } else {
      logAuditEvent(AuditEventType.ERROR_OCCURRED, {
        service: 'LLM_POLISH',
        errorCode: error.code || 'UNKNOWN',
      });
    }

    // Fallback to original text on error
    const body = JSON.parse(event.body || '{}');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(origin),
        ...getSecurityHeaders(),
      },
      body: JSON.stringify({
        polishedText: body.text || '',
      }),
    };
  }
};
