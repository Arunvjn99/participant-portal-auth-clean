/**
 * Rate Limiter Utility
 * In-memory rate limiting for Netlify Functions
 * 
 * Production: Consider using Redis for distributed rate limiting
 */

// In-memory store (resets on cold start)
const rateLimitStore = new Map();

/**
 * Check rate limit for a user/IP
 * @param {string} identifier - User ID or IP address
 * @param {string} endpoint - Endpoint name (stt, tts, llm)
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {object} { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(identifier, endpoint, maxRequests, windowMs) {
  const key = `${identifier}:${endpoint}`;
  const now = Date.now();
  
  // Get existing record or create new
  let record = rateLimitStore.get(key);
  
  if (!record || now > record.resetAt) {
    // Create new window
    record = {
      count: 0,
      resetAt: now + windowMs,
    };
  }
  
  record.count++;
  rateLimitStore.set(key, record);
  
  const allowed = record.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - record.count);
  
  return {
    allowed,
    remaining,
    resetAt: record.resetAt,
  };
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(event) {
  // Try to get user ID from headers (if authenticated)
  const userId = event.headers['x-user-id'] || event.headers['x-userid'];
  
  // Fallback to IP address
  const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
             event.headers['x-nf-client-connection-ip'] ||
             event.clientContext?.ip ||
             'unknown';
  
  return userId || ip;
}

/**
 * Clean up old entries (call periodically or on cold start)
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}
