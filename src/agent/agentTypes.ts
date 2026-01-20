/**
 * Agent Type Definitions
 * Strict types for agent state and responses
 */

import { AgentState as GlobalAgentState, TaskType } from "../types/voice";

export type RequiredInput = "NONE" | "YES_NO" | "NUMBER" | "TEXT" | "CONFIRMATION";

export interface AgentState {
  agentState: GlobalAgentState;
  currentTask: TaskType | null;
  currentStep: string | null;
  requiredInput: RequiredInput;
  collectedData: Record<string, unknown>;
  lastAgentMessage: string | null;
  taskHistory: string[]; // Step history for goBack()
}

export interface AgentResponse {
  text: string;
  uiStateHint: "IDLE" | "LISTENING" | "THINKING" | "SPEAKING" | "AWAITING_INPUT" | "CONFIRMATION_REQUIRED" | "COMPLETED" | "ERROR";
  requiresConfirmation: boolean;
  confirmationPhrase?: string;
  quickReplies?: string[];
  errorMessage?: string;
}

export type Intent =
  | "START_ENROLLMENT"
  | "START_LOAN"
  | "ANSWER_INPUT"
  | "CONFIRM"
  | "CANCEL"
  | "GO_BACK"
  | "REPEAT"
  | "GENERAL_QUESTION"
  | "UNKNOWN";

export interface TaskStep {
  id: string;
  label: string;
  requiredInput: RequiredInput;
  validateInput?: (input: string, collectedData: Record<string, unknown>) => boolean;
  getPrompt: (collectedData: Record<string, unknown>) => string;
  getNextStep?: (collectedData: Record<string, unknown>) => string | null;
}
