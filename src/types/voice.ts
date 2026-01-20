/**
 * Voice Mode Type Definitions
 * Strict state enums and task types for agentic voice interaction
 */

export enum UIState {
  IDLE = "IDLE",
  LISTENING = "LISTENING",
  THINKING = "THINKING",
  SPEAKING = "SPEAKING",
  AWAITING_INPUT = "AWAITING_INPUT",
  CONFIRMATION_REQUIRED = "CONFIRMATION_REQUIRED",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
}

export enum AgentState {
  IDLE = "IDLE",
  TASK_SELECTION = "TASK_SELECTION",
  TASK_IN_PROGRESS = "TASK_IN_PROGRESS",
  CONFIRMATION = "CONFIRMATION",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  ERROR = "ERROR",
}

export enum TaskType {
  ENROLLMENT = "ENROLLMENT",
  LOAN = "LOAN",
  POST_ENROLLMENT_HELP = "POST_ENROLLMENT_HELP",
  GENERAL_QA = "GENERAL_QA",
}

export interface VoiceMessage {
  id: string;
  type: "agent" | "user";
  text: string;
  timestamp: Date;
  quickReplies?: string[];
}

export interface VoiceTask {
  type: TaskType;
  startedAt: Date;
  data?: Record<string, unknown>;
}

export interface VoiceState {
  uiState: UIState;
  agentState: AgentState;
  currentTask: TaskType | null;
  messages: VoiceMessage[];
  lastUserInput: string;
  confirmationPhrase?: string;
  errorMessage?: string;
}
