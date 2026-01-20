/**
 * Intent Classifier
 * Deterministic intent detection using keyword matching and regex
 * NO LLM usage
 */

import type { Intent } from "./agentTypes";

/**
 * Convert spoken numbers to numeric values
 */
const parseSpokenNumber = (text: string): number | null => {
  const lowerText = text.toLowerCase().trim();

  // Direct numeric patterns
  const directNumber = /(\d+(?:,\d{3})*(?:\.\d+)?)/.exec(lowerText);
  if (directNumber) {
    return parseFloat(directNumber[1].replace(/,/g, ""));
  }

  // Spoken number words
  const numberWords: Record<string, number> = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
    twenty: 20,
    thirty: 30,
    forty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90,
    hundred: 100,
    thousand: 1000,
    million: 1000000,
    // Slang/alternate forms
    grand: 1000,
    k: 1000,
    g: 1000,
  };

  // PART 2: Enhanced parsing for spoken numbers like "twelve thousand", "ten grand", etc.
  // Remove common currency words and punctuation
  const cleanedText = lowerText
    .replace(/dollars?/g, "")
    .replace(/\$/g, "")
    .replace(/,/g, "")
    .trim();

  const words = cleanedText.split(/\s+/);
  let number = 0;
  let current = 0;

  for (const word of words) {
    const cleanWord = word.replace(/[^a-z]/g, "").toLowerCase();
    if (!cleanWord) continue;
    
    if (numberWords[cleanWord] !== undefined) {
      const value = numberWords[cleanWord];
      if (value >= 1000) {
        // Handle multipliers (thousand, million, grand, k)
        number += current * value;
        current = 0;
      } else if (value >= 100) {
        // Handle hundreds
        current = (current || 1) * value;
      } else {
        // Handle ones and tens
        current += value;
      }
    }
  }
  number += current;

  return number > 0 ? number : null;
};

/**
 * Check if text contains a number (spoken or numeric)
 */
const containsNumber = (text: string): boolean => {
  return parseSpokenNumber(text) !== null || /\d/.test(text);
};

/**
 * Classify user intent from transcript
 */
export const classifyIntent = (transcript: string, agentState: { requiredInput: string; currentTask: string | null }): Intent => {
  const lowerText = transcript.toLowerCase().trim();

  // Global commands (always work)
  if (lowerText.includes("cancel") || lowerText === "no" && agentState.requiredInput === "CONFIRMATION") {
    return "CANCEL";
  }

  if (lowerText.includes("go back") || lowerText.includes("back") || lowerText.includes("previous")) {
    return "GO_BACK";
  }

  if (lowerText.includes("repeat") || lowerText === "what" || lowerText === "say that again") {
    return "REPEAT";
  }

  // Task start intents
  if (agentState.currentTask === null) {
    if (
      lowerText.includes("enroll") ||
      lowerText.includes("enrollment") ||
      lowerText.includes("start enrollment") ||
      lowerText.includes("begin enrollment")
    ) {
      return "START_ENROLLMENT";
    }

    if (
      lowerText.includes("loan") ||
      lowerText.includes("borrow") ||
      lowerText.includes("take a loan") ||
      lowerText.includes("apply for loan")
    ) {
      return "START_LOAN";
    }

    // General questions when no task is active
    if (
      lowerText.includes("?") ||
      lowerText.includes("what") ||
      lowerText.includes("how") ||
      lowerText.includes("why") ||
      lowerText.includes("when") ||
      lowerText.includes("where")
    ) {
      return "GENERAL_QUESTION";
    }
  }

  // Confirmation intent (only when confirmation is required) - strict matching
  if (agentState.requiredInput === "CONFIRMATION") {
    // Only accept exact confirmation phrases - do NOT accept generic "yes" or "submit"
    const loanPhrases = [
      "yes, submit loan",
      "confirm loan application",
      "yes submit loan",
      "confirm loan",
    ];
    
    const enrollmentPhrases = [
      "yes, submit enrollment",
      "confirm enrollment",
      "yes submit enrollment",
      "submit enrollment",
    ];
    
    const exactPhrases = [...loanPhrases, ...enrollmentPhrases];
    
    // Check for exact phrase match
    if (exactPhrases.some(phrase => lowerText === phrase || lowerText.includes(phrase))) {
      return "CONFIRM";
    }
    
    // Reject generic confirmations - they should be treated as UNKNOWN
    // This ensures strict confirmation gate
  }

  // Answer input (when input is required)
  if (agentState.requiredInput !== "NONE" && agentState.currentTask !== null) {
    if (agentState.requiredInput === "NUMBER") {
      if (containsNumber(lowerText)) {
        return "ANSWER_INPUT";
      }
    } else if (agentState.requiredInput === "YES_NO") {
      if (lowerText.includes("yes") || lowerText.includes("no") || lowerText === "y" || lowerText === "n") {
        return "ANSWER_INPUT";
      }
    } else if (agentState.requiredInput === "TEXT" || agentState.requiredInput === "CONFIRMATION") {
      // Any non-empty text is valid
      if (lowerText.length > 0) {
        return "ANSWER_INPUT";
      }
    }
  }

  // Default to unknown if we can't classify
  return "UNKNOWN";
};

/**
 * Extract numeric value from transcript
 */
export const extractNumber = (transcript: string): number | null => {
  return parseSpokenNumber(transcript);
};

/**
 * Extract yes/no answer from transcript
 */
export const extractYesNo = (transcript: string): boolean | null => {
  const lowerText = transcript.toLowerCase().trim();
  if (lowerText.includes("yes") || lowerText === "y" || lowerText.includes("ok") || lowerText.includes("okay")) {
    return true;
  }
  if (lowerText.includes("no") || lowerText === "n") {
    return false;
  }
  return null;
};
