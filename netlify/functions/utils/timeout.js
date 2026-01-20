/**
 * Timeout Utility
 * Creates promises that reject after timeout
 */

/**
 * Create a timeout promise
 */
export function createTimeout(ms, errorMessage = 'Request timeout') {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(errorMessage));
    }, ms);
  });
}

/**
 * Race a promise against a timeout
 */
export async function withTimeout(promise, timeoutMs, errorMessage) {
  return Promise.race([
    promise,
    createTimeout(timeoutMs, errorMessage),
  ]);
}

/**
 * Timeout constants
 */
export const TIMEOUTS = {
  STT: 10000, // 10 seconds
  TTS: 10000, // 10 seconds
  LLM: 8000,  // 8 seconds
};
