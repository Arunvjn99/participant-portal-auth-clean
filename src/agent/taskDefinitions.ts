/**
 * Task Definitions
 * Defines steps and logic for each task type
 */

import type { TaskStep, RequiredInput } from "./agentTypes";
import { extractNumber } from "./intentClassifier";

// Mock data
const MOCK_MAX_LOAN_AMOUNT = 50000;
const MOCK_ACCOUNT_BALANCE = 100000;
const MOCK_VESTED_BALANCE = 80000;

/**
 * LOAN Task Steps
 */
export const LOAN_STEPS: Record<string, TaskStep> = {
  ELIGIBILITY_CHECK: {
    id: "ELIGIBILITY_CHECK",
    label: "Eligibility Check",
    requiredInput: "NONE",
    getPrompt: (collectedData: Record<string, unknown>) => {
      // Mock eligibility check - always true for now
      // Safety language: Always include warning about retirement impact
      if (Object.keys(collectedData).length === 0) {
        // First time at this step
        return "I'll check your loan eligibility. Based on your account balance and vesting status, you are eligible for a loan. Important: Taking a loan will reduce your retirement savings growth and impact your long-term retirement goals. What loan amount would you like to request?";
      }
      // Returning to this step
      return "You're eligible for a loan. Important: Taking a loan will reduce your retirement savings growth and impact your long-term retirement goals. What loan amount would you like to request?";
    },
    getNextStep: () => "LOAN_AMOUNT",
  },

  LOAN_AMOUNT: {
    id: "LOAN_AMOUNT",
    label: "Loan Amount",
    requiredInput: "NUMBER",
    validateInput: (input: string, collectedData: Record<string, unknown>) => {
      // Check for ambiguous phrases that should be rejected
      const lowerInput = input.toLowerCase().trim();
      const ambiguousPhrases = ["around", "about", "approximately", "maybe", "perhaps", "roughly", "somewhere"];
      if (ambiguousPhrases.some(phrase => lowerInput.includes(phrase))) {
        return false; // Reject ambiguous input
      }

      const amount = extractNumber(input);
      if (amount === null) return false;
      if (amount <= 0) return false; // Reject zero and negative
      if (amount > MOCK_MAX_LOAN_AMOUNT) return false;
      if (amount > (MOCK_ACCOUNT_BALANCE * 0.5)) {
        // Loan cannot exceed 50% of account balance
        return false;
      }
      return true;
    },
    getPrompt: (collectedData: Record<string, unknown>) => {
      // Check if we have a validation error stored
      if (collectedData._loanAmountError) {
        const errorType = collectedData._loanAmountError as string;
        delete collectedData._loanAmountError; // Clear error after showing
        
        if (errorType === "ambiguous") {
          return `I need a specific loan amount. Please provide an exact dollar amount between $1 and $${MOCK_MAX_LOAN_AMOUNT.toLocaleString()}.`;
        }
        if (errorType === "zero_or_negative") {
          return `The loan amount must be greater than zero. Please enter an amount between $1 and $${MOCK_MAX_LOAN_AMOUNT.toLocaleString()}.`;
        }
        if (errorType === "over_max") {
          return `The maximum loan amount is $${MOCK_MAX_LOAN_AMOUNT.toLocaleString()}. Please enter an amount up to $${MOCK_MAX_LOAN_AMOUNT.toLocaleString()}.`;
        }
        if (errorType === "over_balance") {
          return `Loan amount cannot exceed 50% of your account balance. Please enter an amount up to $${Math.floor(MOCK_ACCOUNT_BALANCE * 0.5).toLocaleString()}.`;
        }
        if (errorType === "invalid") {
          // PART 3: Better error message for parse failure - don't reset step
          return `I need an exact dollar amount. For example, you can say 'twelve thousand dollars' or '12000'. Please provide a specific amount between $1 and $${MOCK_MAX_LOAN_AMOUNT.toLocaleString()}.`;
        }
      }
      
      if (collectedData.loanAmount) {
        const amount = collectedData.loanAmount as number;
        return `You've requested $${amount.toLocaleString()}. What repayment term would you like? Options are 1, 2, 3, 4, or 5 years.`;
      }
      return `What loan amount would you like to request? The maximum is $${MOCK_MAX_LOAN_AMOUNT.toLocaleString()}. Please provide a specific dollar amount.`;
    },
    getNextStep: () => "LOAN_TERM",
  },

  LOAN_TERM: {
    id: "LOAN_TERM",
    label: "Loan Term",
    requiredInput: "NUMBER",
    validateInput: (input: string) => {
      const lowerInput = input.toLowerCase().trim();
      
      // Reject months - only years are allowed
      if (lowerInput.includes("month") || lowerInput.includes("mo")) {
        return false;
      }
      
      const term = extractNumber(input);
      if (term === null) return false;
      
      // Only accept 1-5 years
      if (term < 1 || term > 5) {
        return false;
      }
      
      // Reject decimal values (must be whole years)
      if (term % 1 !== 0) {
        return false;
      }
      
      return true;
    },
    getPrompt: (collectedData: Record<string, unknown>) => {
      // Check if we have a validation error stored
      if (collectedData._loanTermError) {
        const errorType = collectedData._loanTermError as string;
        delete collectedData._loanTermError; // Clear error after showing
        
        if (errorType === "months") {
          return "Loan terms must be specified in years, not months. Please choose 1, 2, 3, 4, or 5 years.";
        }
        if (errorType === "out_of_range") {
          return "The repayment term must be between 1 and 5 years. Please choose 1, 2, 3, 4, or 5 years.";
        }
        if (errorType === "invalid") {
          return "I didn't understand that term. Please specify 1, 2, 3, 4, or 5 years.";
        }
      }
      
      if (collectedData.loanTerm) {
        const term = collectedData.loanTerm as number;
        return `You've selected a ${term}-year repayment term. Let me calculate your monthly repayment amount.`;
      }
      return "What repayment term would you like? Options are 1, 2, 3, 4, or 5 years. Please specify in years only.";
    },
    getNextStep: () => "REPAYMENT_REVIEW",
  },

  REPAYMENT_REVIEW: {
    id: "REPAYMENT_REVIEW",
    label: "Repayment Review",
    requiredInput: "YES_NO",
    getPrompt: (collectedData: Record<string, unknown>) => {
      const amount = collectedData.loanAmount as number;
      const term = collectedData.loanTerm as number;
      // Simple calculation: principal / (term * 12) + interest
      const monthlyPrincipal = amount / (term * 12);
      const interestRate = 0.05; // 5% annual
      const monthlyInterest = (amount * interestRate) / 12;
      const monthlyPayment = monthlyPrincipal + monthlyInterest;

      if (collectedData.acceptRepayment === true) {
        // User accepted - move to recap
        return `For a $${amount.toLocaleString()} loan over ${term} year${term > 1 ? "s" : ""}, your estimated monthly repayment would be approximately $${Math.round(monthlyPayment).toLocaleString()}. Important: This loan will reduce your retirement savings growth and impact your long-term retirement goals.`;
      }

      // Safety warning: Always include retirement impact warning
      return `For a $${amount.toLocaleString()} loan over ${term} year${term > 1 ? "s" : ""}, your estimated monthly repayment would be approximately $${Math.round(monthlyPayment).toLocaleString()}. Important: This loan will reduce your retirement savings growth and impact your long-term retirement goals. Do you want to proceed with this loan?`;
    },
    getNextStep: (collectedData: Record<string, unknown>) => {
      if (collectedData.acceptRepayment === true) {
        return "LOAN_RECAP";
      }
      if (collectedData.acceptRepayment === false) {
        return null; // User declined - end task
      }
      return null; // Still waiting for answer
    },
  },

  LOAN_RECAP: {
    id: "LOAN_RECAP",
    label: "Loan Recap",
    requiredInput: "NONE",
    getPrompt: (collectedData: Record<string, unknown>) => {
      const amount = collectedData.loanAmount as number;
      const term = collectedData.loanTerm as number;
      const monthlyPrincipal = amount / (term * 12);
      const interestRate = 0.05;
      const monthlyInterest = (amount * interestRate) / 12;
      const monthlyPayment = monthlyPrincipal + monthlyInterest;

      // Safety warning: Always include retirement impact
      return `Loan Summary:\n- Amount: $${amount.toLocaleString()}\n- Term: ${term} year${term > 1 ? "s" : ""}\n- Estimated monthly payment: $${Math.round(monthlyPayment).toLocaleString()}\n\nImportant: This loan will reduce your retirement savings growth and impact your long-term retirement goals. To submit this loan application, please confirm by saying exactly "yes, submit loan" or "confirm loan application".`;
    },
    getNextStep: () => "CONFIRM_SUBMIT",
  },

  CONFIRM_SUBMIT: {
    id: "CONFIRM_SUBMIT",
    label: "Confirm Submit",
    requiredInput: "CONFIRMATION",
    validateInput: (input: string) => {
      // Strict confirmation: Only accept exact phrases
      const lowerInput = input.toLowerCase().trim();
      const exactPhrases = [
        "yes, submit loan",
        "confirm loan application",
        "yes submit loan",
        "confirm loan",
      ];
      return exactPhrases.some(phrase => lowerInput === phrase || lowerInput.includes(phrase));
    },
    getPrompt: (collectedData: Record<string, unknown>) => {
      // Check if we have a validation error stored
      if (collectedData._confirmationError) {
        delete collectedData._confirmationError; // Clear error after showing
        return "To submit your loan application, you must say exactly 'yes, submit loan' or 'confirm loan application'. Please use one of these exact phrases.";
      }
      return "To submit your loan application, please confirm by saying exactly 'yes, submit loan' or 'confirm loan application'. This action will submit your loan request for processing.";
    },
    getNextStep: () => null, // End of task
  },
};

/**
 * ENROLLMENT Task Steps
 */
// Mock enrollment data
const MOCK_AVAILABLE_PLANS = [
  { id: "traditional_401k", name: "Traditional 401(k)", description: "Tax-deferred contributions" },
  { id: "roth_401k", name: "Roth 401(k)", description: "Tax-free growth" },
  { id: "roth_ira", name: "Roth IRA", description: "Individual retirement account" },
];

export const ENROLLMENT_STEPS: Record<string, TaskStep> = {
  PLAN_SELECTION: {
    id: "PLAN_SELECTION",
    label: "Plan Selection",
    requiredInput: "TEXT",
    validateInput: (input: string) => {
      const lowerInput = input.toLowerCase().trim();
      // Accept plan names or IDs
      const validPlans = [
        "traditional 401k",
        "traditional",
        "roth 401k",
        "roth",
        "roth ira",
        "traditional_401k",
        "roth_401k",
        "roth_ira",
      ];
      return validPlans.some(plan => lowerInput.includes(plan));
    },
    getPrompt: (collectedData: Record<string, unknown>) => {
      // Check if we have a validation error
      if (collectedData._planSelectionError) {
        delete collectedData._planSelectionError;
        return "I didn't recognize that plan. Available plans are: Traditional 401(k), Roth 401(k), or Roth IRA. Which plan would you like to select?";
      }
      
      if (collectedData.selectedPlan) {
        const plan = MOCK_AVAILABLE_PLANS.find(p => p.id === collectedData.selectedPlan as string);
        const planName = plan?.name || collectedData.selectedPlan;
        return `You've selected ${planName}. What percentage of your salary would you like to contribute?`;
      }
      
      // Build plan list
      const planList = MOCK_AVAILABLE_PLANS.map(p => p.name).join(", ");
      const planCount = MOCK_AVAILABLE_PLANS.length;
      
      if (planCount === 1) {
        const plan = MOCK_AVAILABLE_PLANS[0];
        return `You have one available plan: ${plan.name} (${plan.description}). Do you want to enroll in this plan? Please confirm by saying the plan name.`;
      }
      
      return `Available plans: ${planList}. Which plan would you like to enroll in?`;
    },
    getNextStep: (collectedData: Record<string, unknown>) => {
      if (collectedData.selectedPlan) {
        return "CONTRIBUTION";
      }
      return null;
    },
  },

  CONTRIBUTION: {
    id: "CONTRIBUTION",
    label: "Contribution",
    requiredInput: "NUMBER",
    validateInput: (input: string, collectedData: Record<string, unknown>) => {
      // Check for ambiguous phrases
      const lowerInput = input.toLowerCase().trim();
      const ambiguousPhrases = ["around", "about", "approximately", "maybe", "perhaps", "roughly", "somewhere", "suggest", "recommend", "advise"];
      if (ambiguousPhrases.some(phrase => lowerInput.includes(phrase))) {
        return false;
      }
      
      const percentage = extractNumber(input);
      if (percentage === null) return false;
      
      // Percentage must be between 1 and 100
      if (percentage < 1 || percentage > 100) {
        return false;
      }
      
      // Reject decimal values for percentage (or allow up to 2 decimals)
      // For simplicity, we'll allow decimals but validate range
      return true;
    },
    getPrompt: (collectedData: Record<string, unknown>) => {
      // Check if we have a validation error
      if (collectedData._contributionError) {
        const errorType = collectedData._contributionError as string;
        delete collectedData._contributionError;
        
        if (errorType === "ambiguous") {
          return "I need a specific contribution percentage. Please provide a number between 1 and 100 percent.";
        }
        if (errorType === "out_of_range") {
          return "Contribution percentage must be between 1 and 100 percent. Please enter a valid percentage.";
        }
        if (errorType === "invalid") {
          return "I didn't understand that percentage. Please provide a number between 1 and 100 percent.";
        }
      }
      
      if (collectedData.contributionPercentage) {
        const percentage = collectedData.contributionPercentage as number;
        return `You've selected a ${percentage}% contribution. How would you like to allocate your investments? You can choose: Plan Default, Manual, or Advisor (if available).`;
      }
      
      return "What percentage of your salary would you like to contribute? Please provide a number between 1 and 100 percent.";
    },
    getNextStep: () => "INVESTMENTS",
  },

  INVESTMENTS: {
    id: "INVESTMENTS",
    label: "Investments",
    requiredInput: "TEXT",
    validateInput: (input: string) => {
      const lowerInput = input.toLowerCase().trim();
      const validChoices = [
        "plan default",
        "default",
        "manual",
        "advisor",
        "plan_default",
        "manual_allocation",
        "advisor_managed",
      ];
      return validChoices.some(choice => lowerInput.includes(choice));
    },
    getPrompt: (collectedData: Record<string, unknown>) => {
      // Check if we have a validation error
      if (collectedData._investmentsError) {
        delete collectedData._investmentsError;
        return "I didn't recognize that option. Please choose: Plan Default, Manual, or Advisor (if available).";
      }
      
      if (collectedData.investmentApproach) {
        const approach = collectedData.investmentApproach as string;
        
        if (approach === "manual" || approach === "manual_allocation") {
          // Manual selection - route to UI (we'll handle this by pausing)
          return "You've selected Manual investment allocation. For manual allocation, please use the investment screen in the UI. I'll pause here until you return. Say 'continue' when you're ready to proceed with enrollment review.";
        }
        
        const approachName = approach === "plan_default" ? "Plan Default" : 
                            approach === "advisor" || approach === "advisor_managed" ? "Advisor" : approach;
        return `You've selected ${approachName} investment approach. Let me review your enrollment details.`;
      }
      
      return "How would you like to allocate your investments? You can choose: Plan Default (automatic allocation), Manual (you select allocations), or Advisor (if available). Which option would you like?";
    },
    getNextStep: (collectedData: Record<string, unknown>) => {
      if (collectedData.investmentApproach) {
        // If manual, we need to wait for user to return from UI
        // For now, we'll proceed to review (in real implementation, this would pause)
        if (collectedData.investmentApproach === "manual" || collectedData.investmentApproach === "manual_allocation") {
          // Check if user has indicated they're ready to continue
          if (collectedData.manualAllocationComplete) {
            return "REVIEW";
          }
          // Stay at INVESTMENTS until user says continue
          return null;
        }
        return "REVIEW";
      }
      return null;
    },
  },

  REVIEW: {
    id: "REVIEW",
    label: "Review",
    requiredInput: "NONE",
    getPrompt: (collectedData: Record<string, unknown>) => {
      const plan = MOCK_AVAILABLE_PLANS.find(p => p.id === collectedData.selectedPlan as string);
      const planName = plan?.name || collectedData.selectedPlan || "Unknown plan";
      const contribution = collectedData.contributionPercentage as number;
      const investmentApproach = collectedData.investmentApproach as string;
      
      let investmentText = "";
      if (investmentApproach === "plan_default" || investmentApproach === "default") {
        investmentText = "Plan Default";
      } else if (investmentApproach === "manual" || investmentApproach === "manual_allocation") {
        investmentText = "Manual Allocation";
      } else if (investmentApproach === "advisor" || investmentApproach === "advisor_managed") {
        investmentText = "Advisor Managed";
      } else {
        investmentText = investmentApproach || "Not specified";
      }
      
      return `Enrollment Summary:\n- Plan: ${planName}\n- Contribution: ${contribution}% of salary\n- Investment Approach: ${investmentText}\n\nPlease review these details. You can say "go back" to change any section, or say "yes, submit enrollment" to confirm.`;
    },
    getNextStep: () => "CONFIRM_SUBMIT",
  },

  CONFIRM_SUBMIT: {
    id: "CONFIRM_SUBMIT",
    label: "Confirm Submit",
    requiredInput: "CONFIRMATION",
    validateInput: (input: string) => {
      // Strict confirmation: Only accept exact phrases
      const lowerInput = input.toLowerCase().trim();
      const exactPhrases = [
        "yes, submit enrollment",
        "confirm enrollment",
        "yes submit enrollment",
        "submit enrollment",
      ];
      return exactPhrases.some(phrase => lowerInput === phrase || lowerInput.includes(phrase));
    },
    getPrompt: (collectedData: Record<string, unknown>) => {
      // Check if we have a validation error stored
      if (collectedData._confirmationError) {
        delete collectedData._confirmationError;
        return "To submit your enrollment, you must say exactly 'yes, submit enrollment' or 'confirm enrollment'. Please use one of these exact phrases.";
      }
      return "To submit your enrollment, please confirm by saying exactly 'yes, submit enrollment' or 'confirm enrollment'. This action will submit your enrollment for processing.";
    },
    getNextStep: () => null, // End of task
  },
};

/**
 * POST_ENROLLMENT_HELP Task Steps (simplified)
 */
export const POST_ENROLLMENT_HELP_STEPS: Record<string, TaskStep> = {
  START: {
    id: "START",
    label: "Help",
    requiredInput: "NONE",
    getPrompt: () => {
      return "I can help answer questions about your account, contributions, investments, or beneficiaries. What would you like to know?";
    },
    getNextStep: () => null,
  },
};

/**
 * Get task steps by task type
 */
export const getTaskSteps = (taskType: string): Record<string, TaskStep> => {
  switch (taskType) {
    case "LOAN":
      return LOAN_STEPS;
    case "ENROLLMENT":
      return ENROLLMENT_STEPS;
    case "POST_ENROLLMENT_HELP":
      return POST_ENROLLMENT_HELP_STEPS;
    default:
      return {};
  }
};

/**
 * Get first step for a task
 */
export const getFirstStep = (taskType: string): string | null => {
  const steps = getTaskSteps(taskType);
  const stepIds = Object.keys(steps);
  return stepIds.length > 0 ? stepIds[0] : null;
};
