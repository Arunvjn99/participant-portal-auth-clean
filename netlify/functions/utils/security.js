/**
 * Security Headers and CORS Configuration
 */

/**
 * Get allowed CORS origins from environment
 */
function getAllowedOrigins() {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  
  // Add production domain if set
  if (process.env.SITE_URL) {
    allowedOrigins.push(process.env.SITE_URL);
  }
  
  // Development fallback
  if (allowedOrigins.length === 0) {
    allowedOrigins.push('http://localhost:5173', 'http://localhost:3000');
  }
  
  return allowedOrigins;
}

/**
 * Check if origin is allowed
 */
export function isOriginAllowed(origin) {
  const allowedOrigins = getAllowedOrigins();
  return allowedOrigins.includes(origin);
}

/**
 * Get security headers
 */
export function getSecurityHeaders() {
  return {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}

/**
 * Get CORS headers for response
 */
export function getCorsHeaders(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id',
    'Access-Control-Max-Age': '86400',
  };

  if (origin && isOriginAllowed(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  return headers;
}

/**
 * Handle OPTIONS preflight request
 */
export function handleOptionsRequest(event) {
  const origin = event.headers.origin || event.headers.Origin;
  const corsHeaders = getCorsHeaders(origin);
  const securityHeaders = getSecurityHeaders();

  return {
    statusCode: 204,
    headers: {
      ...corsHeaders,
      ...securityHeaders,
    },
    body: '',
  };
}
