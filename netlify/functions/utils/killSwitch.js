/**
 * Kill Switch Utility
 * Runtime feature flags to disable services instantly
 */

/**
 * Check if STT is enabled
 */
export function isSTTEnabled() {
  return process.env.STT_ENABLED !== 'false';
}

/**
 * Check if TTS is enabled
 */
export function isTTSEnabled() {
  return process.env.TTS_ENABLED !== 'false';
}

/**
 * Check if LLM is enabled
 */
export function isLLMEnabled() {
  return process.env.LLM_ENABLED !== 'false';
}

/**
 * Get kill switch status response
 */
export function getKillSwitchResponse(serviceName) {
  return {
    statusCode: 503,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': '60', // Suggest retry after 60 seconds
    },
    body: JSON.stringify({
      error: `${serviceName} service disabled`,
      message: 'This service is temporarily unavailable. Please use text input instead.',
      code: 'SERVICE_DISABLED',
    }),
  };
}
