/**
 * LLM Enhancer
 * Safe language enhancement layer that NEVER influences logic or validation
 * 
 * Architecture: AgentController → AgentResponse → LLM Enhancer → UI / TTS
 * 
 * Rules:
 * - LLM is called ONLY after AgentController
 * - LLM can ONLY enhance language, never change logic
 * - All validation happens before LLM
 * - Fallback to raw message on any failure
 */

import type { AgentResponse } from "./agentTypes";

/**
 * Feature flag to disable LLM instantly
 */
export const LLM_ENABLED = import.meta.env.VITE_LLM_ENABLED === "true" || false;

/**
 * LLM input contract - structured data only
 */
export interface LLMEnhancementInput {
  rawMessage: string;
  step: string | null;
  task: string | null;
  constraints?: {
    maxLength?: number;
    preserveNumbers?: boolean;
    preservePhrases?: string[];
  };
  tone: "neutral";
  compliance: {
    noAdvice: boolean;
    warningRequired: boolean;
  };
}

/**
 * LLM output validation result
 */
interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * Validate LLM output for safety
 * Rejects output that:
 * - Adds advice, numbers, or suggestions
 * - Exceeds length limits
 * - Changes intent
 */
function validateLLMOutput(
  original: string,
  enhanced: string,
  constraints?: LLMEnhancementInput["constraints"]
): ValidationResult {
  // Check length
  const maxLength = constraints?.maxLength || original.length * 2; // Allow up to 2x original
  if (enhanced.length > maxLength) {
    return { isValid: false, reason: "Output exceeds length limit" };
  }

  // Check for forbidden advice patterns
  const advicePatterns = [
    /\b(should|recommend|suggest|advise|better|best|optimal|ideal)\b/gi,
    /\b(you should|I recommend|I suggest|you might want|consider)\b/gi,
  ];
  
  for (const pattern of advicePatterns) {
    if (pattern.test(enhanced) && !pattern.test(original)) {
      return { isValid: false, reason: "Output contains advice language" };
    }
  }

  // Check for new numbers (unless preserveNumbers is false)
  if (constraints?.preserveNumbers !== false) {
    const originalNumbers = original.match(/\d+(?:\.\d+)?/g) || [];
    const enhancedNumbers = enhanced.match(/\d+(?:\.\d+)?/g) || [];
    
    // If enhanced has more numbers than original, reject
    if (enhancedNumbers.length > originalNumbers.length) {
      return { isValid: false, reason: "Output adds new numbers" };
    }
  }

  // Check for preserved phrases (must be present if specified)
  if (constraints?.preservePhrases) {
    for (const phrase of constraints.preservePhrases) {
      if (original.includes(phrase) && !enhanced.includes(phrase)) {
        return { isValid: false, reason: `Output removes required phrase: ${phrase}` };
      }
    }
  }

  // Check for intent-changing phrases
  const intentPhrases = [
    "submit",
    "confirm",
    "cancel",
    "go back",
    "yes, submit",
    "confirm enrollment",
    "confirm loan",
  ];
  
  for (const phrase of intentPhrases) {
    const originalHas = original.toLowerCase().includes(phrase);
    const enhancedHas = enhanced.toLowerCase().includes(phrase);
    
    if (originalHas !== enhancedHas) {
      return { isValid: false, reason: `Output changes intent phrase: ${phrase}` };
    }
  }

  return { isValid: true };
}

/**
 * Mock LLM call - replace with actual LLM API call
 * Returns enhanced message or null on failure
 */
async function callLLM(input: LLMEnhancementInput): Promise<string | null> {
  // Mock implementation - simulate API call
  // In production, replace with actual LLM API call
  
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock enhancement: simple rephrasing
    // In production, this would be an actual LLM API call
    const { rawMessage, step, task, compliance } = input;
    
    // Only enhance if it's a regular message (not confirmation/error)
    if (rawMessage.includes("yes, submit") || rawMessage.includes("confirm")) {
      // Don't enhance confirmation phrases
      return null;
    }
    
    // Simple mock enhancement - just return original for now
    // In production, this would call OpenAI, Anthropic, etc.
    return rawMessage;
    
    // Example of what a real enhancement might look like:
    // if (step === "LOAN_AMOUNT") {
    //   return `I'd like to help you with your loan amount. ${rawMessage}`;
    // }
    // return rawMessage;
  } catch (error) {
    console.error("LLM enhancement failed:", error);
    return null;
  }
}

/**
 * Enhance agent response text using LLM
 * Returns enhanced text or original text on failure
 * 
 * NOTE: This function is kept for backward compatibility.
 * Consider using LLMResponsePolisher() directly for new code.
 */
export async function enhanceAgentResponse(
  agentResponse: AgentResponse,
  agentState: {
    currentStep: string | null;
    currentTask: string | null;
  }
): Promise<string> {
  // Feature flag check
  if (!LLM_ENABLED) {
    return agentResponse.text;
  }

  // Don't enhance error messages or confirmation phrases
  if (
    agentResponse.errorMessage ||
    agentResponse.uiStateHint === "ERROR" ||
    agentResponse.uiStateHint === "CONFIRMATION_REQUIRED" ||
    agentResponse.text.includes("yes, submit") ||
    agentResponse.text.includes("confirm")
  ) {
    return agentResponse.text;
  }

  // Build LLM input
  const llmInput: LLMEnhancementInput = {
    rawMessage: agentResponse.text,
    step: agentState.currentStep,
    task: agentState.currentTask,
    constraints: {
      maxLength: agentResponse.text.length * 2, // Allow up to 2x original
      preserveNumbers: true, // Don't add or change numbers
      preservePhrases: agentResponse.confirmationPhrase
        ? [agentResponse.confirmationPhrase]
        : undefined,
    },
    tone: "neutral",
    compliance: {
      noAdvice: true, // Never give financial advice
      warningRequired: agentResponse.text.includes("Important:") || agentResponse.text.includes("warning"),
    },
  };

  try {
    // Call LLM
    const enhanced = await callLLM(llmInput);
    
    if (!enhanced) {
      return agentResponse.text; // Fallback to original
    }

    // Validate output
    const validation = validateLLMOutput(agentResponse.text, enhanced, llmInput.constraints);
    
    if (!validation.isValid) {
      console.warn("LLM output validation failed:", validation.reason);
      return agentResponse.text; // Fallback to original
    }

    return enhanced;
  } catch (error) {
    console.error("LLM enhancement error:", error);
    return agentResponse.text; // Fallback to original
  }
}

/**
 * Synchronous version for immediate use (uses cached or mock)
 * Use this when async is not possible
 */
export function enhanceAgentResponseSync(
  agentResponse: AgentResponse,
  agentState: {
    currentStep: string | null;
    currentTask: string | null;
  }
): string {
  // Feature flag check
  if (!LLM_ENABLED) {
    return agentResponse.text;
  }

  // Don't enhance error messages or confirmation phrases
  if (
    agentResponse.errorMessage ||
    agentResponse.uiStateHint === "ERROR" ||
    agentResponse.uiStateHint === "CONFIRMATION_REQUIRED" ||
    agentResponse.text.includes("yes, submit") ||
    agentResponse.text.includes("confirm")
  ) {
    return agentResponse.text;
  }

  // For sync version, just return original
  // In production, you might use a cached result or synchronous LLM
  return agentResponse.text;
}

/**
 * PART 1: Number Normalization (Pre-Agent)
 * Normalizes spoken numeric phrases in user input before AgentController processes it
 * 
 * Example: "twelve thousand" → "12000"
 */
export interface NumberNormalizationResult {
  normalizedText: string;
  numbers: Array<{
    original: string;
    value: number;
  }>;
}

/**
 * Normalize spoken numbers in user input using LLM
 * Returns normalized text with extracted numbers, or original text on failure
 */
export async function normalizeUserInputWithLLM(
  inputText: string
): Promise<{ normalizedText: string; extractedNumbers: number[] }> {
  // Feature flag check
  if (!LLM_ENABLED) {
    // Fallback to deterministic parsing
    return {
      normalizedText: inputText,
      extractedNumbers: [],
    };
  }

  // Skip normalization for very short inputs or inputs that are already numeric
  if (!inputText.trim() || /^\d+$/.test(inputText.trim())) {
    return {
      normalizedText: inputText,
      extractedNumbers: [],
    };
  }

  try {
    // Call LLM for number normalization
    const llmInput = {
      task: "NUMBER_NORMALIZATION",
      text: inputText,
    };

    const llmResponse = await callLLMNumberNormalization(llmInput);
    
    if (!llmResponse) {
      // Fallback to original
      return {
        normalizedText: inputText,
        extractedNumbers: [],
      };
    }

    // Validate LLM response
    if (!validateNumberNormalization(inputText, llmResponse)) {
      console.warn("LLM number normalization validation failed - using original");
      return {
        normalizedText: inputText,
        extractedNumbers: [],
      };
    }

    // Extract numeric values for potential use
    const extractedNumbers = llmResponse.numbers.map(n => n.value);

    return {
      normalizedText: llmResponse.normalizedText,
      extractedNumbers,
    };
  } catch (error) {
    console.error("LLM number normalization error:", error);
    // Always fallback to original
    return {
      normalizedText: inputText,
      extractedNumbers: [],
    };
  }
}

/**
 * PART 2: Response Phrase Polish (Post-Agent)
 * Polishes agent response wording without changing meaning
 */
export async function LLMResponsePolisher(
  rawAgentText: string,
  constraints?: {
    noAdvice?: boolean;
    maxLength?: number;
    preservePhrases?: string[];
  }
): Promise<string> {
  // Feature flag check
  if (!LLM_ENABLED) {
    return rawAgentText;
  }

  // Don't polish error messages, confirmations, or very short messages
  if (
    !rawAgentText.trim() ||
    rawAgentText.length < 10 ||
    rawAgentText.includes("yes, submit") ||
    rawAgentText.includes("confirm") ||
    rawAgentText.includes("Error:") ||
    rawAgentText.includes("ERROR")
  ) {
    return rawAgentText;
  }

  try {
    const llmInput = {
      text: rawAgentText,
      tone: "neutral" as const,
      constraints: {
        noAdvice: constraints?.noAdvice ?? true,
        maxLength: constraints?.maxLength ?? 3, // Max 3 short lines
        preservePhrases: constraints?.preservePhrases,
      },
    };

    const polished = await callLLMResponsePolish(llmInput);
    
    if (!polished) {
      return rawAgentText; // Fallback
    }

    // Validate polished output
    if (!validatePolishedResponse(rawAgentText, polished, llmInput.constraints)) {
      console.warn("LLM response polish validation failed - using original");
      return rawAgentText;
    }

    return polished;
  } catch (error) {
    console.error("LLM response polish error:", error);
    return rawAgentText; // Always fallback
  }
}

/**
 * Mock LLM call for number normalization
 * In production, replace with actual LLM API call
 * 
 * Expected API format:
 * POST /api/llm/normalize
 * {
 *   "task": "NUMBER_NORMALIZATION",
 *   "text": "I want twelve thousand dollars"
 * }
 * 
 * Response:
 * {
 *   "normalizedText": "I want 12000 dollars",
 *   "numbers": [
 *     { "original": "twelve thousand", "value": 12000 }
 *   ]
 * }
 */
async function callLLMNumberNormalization(
  input: { task: string; text: string }
): Promise<NumberNormalizationResult | null> {
  try {
    // Check if LLM API endpoint exists (in production)
    const LLM_API_ENDPOINT = import.meta.env.VITE_LLM_API_ENDPOINT;
    
    if (LLM_API_ENDPOINT) {
      // Call actual LLM API
      const response = await fetch(`${LLM_API_ENDPOINT}/normalize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`LLM API returned ${response.status}`);
      }

      const result = await response.json();
      
      // Validate response structure
      if (
        result &&
        typeof result.normalizedText === "string" &&
        Array.isArray(result.numbers)
      ) {
        return result as NumberNormalizationResult;
      }
      
      throw new Error("Invalid LLM response format");
    }

    // Mock implementation (fallback when no API endpoint)
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));

    const lowerText = input.text.toLowerCase();
    
    // Check for spoken numbers that might need normalization
    // This is a simple mock - in production, LLM would handle complex cases
    const spokenPatterns: Record<string, number> = {
      "twelve thousand": 12000,
      "ten thousand": 10000,
      "five thousand": 5000,
      "fifteen thousand": 15000,
      "twenty thousand": 20000,
      "twenty-five thousand": 25000,
      "thirty thousand": 30000,
      "ten grand": 10000,
      "twelve grand": 12000,
      "five grand": 5000,
      "fifteen grand": 15000,
      "twenty grand": 20000,
    };

    let normalizedText = input.text;
    const numbers: Array<{ original: string; value: number }> = [];

    // Match longest patterns first
    const sortedPatterns = Object.entries(spokenPatterns).sort(
      (a, b) => b[0].length - a[0].length
    );

    for (const [phrase, value] of sortedPatterns) {
      if (lowerText.includes(phrase)) {
        const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        normalizedText = normalizedText.replace(regex, value.toString());
        numbers.push({ original: phrase, value });
        break; // Only normalize first match in mock
      }
    }

    // If we found numbers, return normalized result
    if (numbers.length > 0) {
      return {
        normalizedText,
        numbers,
      };
    }

    // No normalization needed - return null to use original
    return null;
  } catch (error) {
    console.error("LLM number normalization call failed:", error);
    return null;
  }
}

/**
 * Mock LLM call for response polishing
 * In production, replace with actual LLM API call
 * 
 * Expected API format:
 * POST /api/llm/polish
 * {
 *   "text": "What loan amount would you like to request?",
 *   "tone": "neutral",
 *   "constraints": {
 *     "noAdvice": true,
 *     "maxLength": 3,
 *     "preservePhrases": []
 *   }
 * }
 * 
 * Response:
 * {
 *   "polishedText": "What loan amount would you like to request?"
 * }
 */
async function callLLMResponsePolish(
  input: {
    text: string;
    tone: "neutral";
    constraints: {
      noAdvice: boolean;
      maxLength: number;
      preservePhrases?: string[];
    };
  }
): Promise<string | null> {
  try {
    // Check if LLM API endpoint exists (in production)
    const LLM_API_ENDPOINT = import.meta.env.VITE_LLM_API_ENDPOINT;
    
    if (LLM_API_ENDPOINT) {
      // Call actual LLM API
      const response = await fetch(`${LLM_API_ENDPOINT}/polish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`LLM API returned ${response.status}`);
      }

      const result = await response.json();
      
      // Validate response structure
      if (result && typeof result.polishedText === "string") {
        return result.polishedText;
      }
      
      throw new Error("Invalid LLM response format");
    }

    // Mock implementation (fallback when no API endpoint)
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));

    // For now, return null to use original (no mock polishing)
    // In production, this would call OpenAI, Anthropic, etc.
    // The LLM would polish wording while preserving:
    // - All numbers
    // - All questions
    // - All required phrases
    // - Meaning and intent
    
    return null;
  } catch (error) {
    console.error("LLM response polish call failed:", error);
    return null;
  }
}

/**
 * Validate number normalization result
 * Ensures LLM didn't invent numbers or change meaning
 */
function validateNumberNormalization(
  original: string,
  result: NumberNormalizationResult
): boolean {
  // Must not add numbers that weren't in original
  // This is a simple check - in production, you might want more sophisticated validation
  
  // Check that normalized text contains the numeric values
  if (result.numbers.length > 0) {
    for (const num of result.numbers) {
      if (!result.normalizedText.includes(num.value.toString())) {
        return false; // LLM added a number not present
      }
    }
  }

  // Check that original numeric values are preserved
  const originalNumbers = original.match(/\d+/g) || [];
  const normalizedNumbers = result.normalizedText.match(/\d+/g) || [];
  
  // If original had numbers, normalized should have at least those
  if (originalNumbers.length > 0 && normalizedNumbers.length < originalNumbers.length) {
    return false; // LLM removed numbers
  }

  return true;
}

/**
 * Validate polished response
 * Ensures meaning is preserved and no advice/numbers are added
 */
function validatePolishedResponse(
  original: string,
  polished: string,
  constraints: {
    noAdvice: boolean;
    maxLength: number;
    preservePhrases?: string[];
  }
): boolean {
  // Check length constraint (max 3 lines)
  const polishedLines = polished.split('\n').filter(l => l.trim());
  if (polishedLines.length > constraints.maxLength) {
    return false;
  }

  // Check for advice language
  if (constraints.noAdvice) {
    const advicePatterns = [
      /\b(should|recommend|suggest|advise|better|best|optimal|ideal)\b/gi,
      /\b(you should|I recommend|I suggest|you might want|consider)\b/gi,
    ];
    
    for (const pattern of advicePatterns) {
      if (pattern.test(polished) && !pattern.test(original)) {
        return false; // Added advice
      }
    }
  }

  // Check for new numbers
  const originalNumbers = original.match(/\d+(?:\.\d+)?/g) || [];
  const polishedNumbers = polished.match(/\d+(?:\.\d+)?/g) || [];
  
  if (polishedNumbers.length > originalNumbers.length) {
    return false; // Added numbers
  }

  // Check preserved phrases
  if (constraints.preservePhrases) {
    for (const phrase of constraints.preservePhrases) {
      if (original.includes(phrase) && !polished.includes(phrase)) {
        return false; // Removed required phrase
      }
    }
  }

  // Check that questions are preserved
  const originalIsQuestion = original.trim().endsWith('?');
  const polishedIsQuestion = polished.trim().endsWith('?');
  
  if (originalIsQuestion !== polishedIsQuestion) {
    return false; // Changed question status
  }

  return true;
}
