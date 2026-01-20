/**
 * Safe Audit Logger
 * Logs only safe metadata, NEVER sensitive data
 */

/**
 * Log audit event
 * ONLY logs: task type, step, action type, error codes
 * NEVER logs: audio, transcripts, SSN, bank data, personal info
 */
export function logAuditEvent(eventType, metadata = {}) {
  // Extract only safe fields
  const safeMetadata = {
    timestamp: new Date().toISOString(),
    eventType,
    task: metadata.task || null, // task type only
    step: metadata.step || null, // step name only
    action: metadata.action || null, // action type only
    errorCode: metadata.errorCode || null, // error code only
    // Explicitly exclude sensitive fields
    // NO: transcript, audio, ssn, accountNumber, amount, etc.
  };

  // Log to console (Netlify Functions logs)
  console.log('[AUDIT]', JSON.stringify(safeMetadata));

  // In production, you might send to external logging service
  // Example: sendToLoggingService(safeMetadata);
}

/**
 * Audit event types
 */
export const AuditEventType = {
  TASK_STARTED: 'task_started',
  STEP_ENTERED: 'step_entered',
  CONFIRMATION_SUBMITTED: 'confirmation_submitted',
  CANCEL_INVOKED: 'cancel_invoked',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  TIMEOUT_OCCURRED: 'timeout_occurred',
  KILL_SWITCH_TRIGGERED: 'kill_switch_triggered',
  ERROR_OCCURRED: 'error_occurred',
};
