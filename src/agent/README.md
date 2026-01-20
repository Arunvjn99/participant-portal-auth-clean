# AgentController Architecture

## Overview

The AgentController is a deterministic agent system that manages all agent state and logic for Voice Mode. It enforces strict state machine rules and never touches UI or audio directly.

## Architecture

```
VoiceModePage (UI)
  ↓
AgentController (State + Logic)
  ↓
Intent Classifier (Deterministic)
  ↓
Task Definitions (Step-based)
```

## Core Components

### AgentController.ts
- **Purpose**: Central controller for agent state and logic
- **Responsibilities**:
  - Owns all agent state
  - Processes user transcripts
  - Decides next agent action
  - Enforces state machine rules
- **Never touches**: UI, audio, APIs, or data mutation

### agentTypes.ts
- Type definitions for agent state, responses, and intents
- Strict enums for required input types

### intentClassifier.ts
- Deterministic intent detection using keyword matching
- No LLM usage
- Supports: START_ENROLLMENT, START_LOAN, ANSWER_INPUT, CONFIRM, CANCEL, GO_BACK, REPEAT, GENERAL_QUESTION, UNKNOWN

### taskDefinitions.ts
- Defines steps for each task type
- Currently implements LOAN task fully
- Each step has: id, label, requiredInput, validateInput, getPrompt, getNextStep

## Agent State Model

```typescript
AgentState = {
  agentState: AGENT_STATE,
  currentTask: TASK_TYPE | null,
  currentStep: string | null,
  requiredInput: "NONE" | "YES_NO" | "NUMBER" | "TEXT" | "CONFIRMATION",
  collectedData: Record<string, any>,
  lastAgentMessage: string | null,
  taskHistory: string[] // For goBack()
}
```

## LOAN Task Flow

1. **ELIGIBILITY_CHECK** → Always passes (mock)
2. **LOAN_AMOUNT** → Requires number, validates max amount
3. **LOAN_TERM** → Requires number (1-5 years)
4. **REPAYMENT_REVIEW** → Shows repayment calculation, requires YES/NO
5. **LOAN_RECAP** → Shows summary
6. **CONFIRM_SUBMIT** → Requires explicit confirmation

## State Machine Rules

- Only one active task at a time
- No step skipping
- No submission without confirmation
- Confirmation required for:
  - Loan submission
  - Enrollment submission
- Invalid input → asks for clarification, state does NOT advance

## Global Commands

These work at any state:
- **CANCEL** → Resets agent to IDLE
- **GO_BACK** → Reverts one step safely
- **REPEAT** → Repeats last agent message

## Safety Rules

✅ AgentController:
- Never mutates financial data
- Never calls APIs
- Never talks to UI directly
- No recommendations
- No financial advice language
- No silent state transitions

## Integration

VoiceModePage sends transcript to `AgentController.handleUserInput()` and receives `AgentResponse` with:
- `text`: Agent message
- `uiStateHint`: Suggested UI state
- `requiresConfirmation`: Whether confirmation is needed
- `confirmationPhrase`: Exact phrase for confirmation
- `quickReplies`: Optional quick reply buttons

## Example Usage

```typescript
// In VoiceModePage
const agentResponse = agentController.handleUserInput(transcript);
const agentState = agentController.getState();

// Update UI based on response
setVoiceState({
  uiState: mapToUIState(agentResponse.uiStateHint),
  agentState: agentState.agentState,
  currentTask: agentState.currentTask,
  // ...
});
```

## Testing

The system is deterministic and can be tested with:
- Keyword-based intent classification
- Step-by-step task progression
- State machine validation
- Error handling
