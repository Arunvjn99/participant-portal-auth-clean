import type {
  ContributionInput,
  MonthlyContribution,
  ContributionAssumptions,
} from "./types";

/**
 * Calculate monthly contribution amounts based on input
 * 
 * Contribution amounts are interpreted as:
 * - percentage → annual percentage of salary (e.g., 6% = 6% of annual salary)
 * - fixed → monthly fixed amount (e.g., $500 = $500 per month)
 * 
 * Employer match is calculated annually first, then converted to monthly.
 * This ensures correct matching based on annual contribution caps.
 * 
 * IMPORTANT: Employer match is always pre-tax, even for Roth contributions.
 * This is a requirement of 401(k) plans - employer contributions cannot be
 * designated as Roth and are always made on a pre-tax basis.
 */
export const calculateMonthlyContribution = (
  input: ContributionInput,
  assumptions: ContributionAssumptions
): MonthlyContribution => {
  // Calculate annual employee contribution
  // For percentage: contributionAmount is annual percentage of salary
  // For fixed: contributionAmount is monthly amount, multiply by 12 for annual
  const employeeAnnualContribution =
    input.contributionType === "percentage"
      ? (input.salary * input.contributionAmount) / 100
      : input.contributionAmount * 12;

  // Calculate monthly employee contribution
  const monthlyEmployee = employeeAnnualContribution / 12;

  // Calculate employer match annually
  // Note: Employer match is always pre-tax, regardless of contribution source (preTax, afterTax, or roth)
  let employerAnnualMatch = 0;
  if (assumptions.employerMatchPercentage > 0) {
    // Maximum contribution that can be matched (as percentage of salary)
    const maxMatchedContribution = (input.salary * assumptions.employerMatchCap) / 100;
    
    // Employer match is based on the lesser of:
    // 1. Actual employee annual contribution
    // 2. Maximum matched contribution (cap)
    const matchedContribution = Math.min(employeeAnnualContribution, maxMatchedContribution);
    
    // Calculate employer annual match
    employerAnnualMatch = (matchedContribution * assumptions.employerMatchPercentage) / 100;
  }

  // Convert employer match to monthly
  const monthlyEmployer = employerAnnualMatch / 12;

  return {
    employee: monthlyEmployee,
    employer: monthlyEmployer,
    total: monthlyEmployee + monthlyEmployer,
  };
};

/**
 * Convert percentage contribution to annual dollar amount
 * 
 * @param salary Annual salary
 * @param percentage Annual contribution percentage (0-100)
 * @returns Annual contribution amount in dollars
 */
export const percentageToAnnualAmount = (
  salary: number,
  percentage: number
): number => {
  return (salary * percentage) / 100;
};

/**
 * Convert annual dollar amount to percentage of salary
 * 
 * @param salary Annual salary
 * @param annualAmount Annual contribution amount in dollars
 * @returns Contribution percentage (0-100)
 */
export const annualAmountToPercentage = (
  salary: number,
  annualAmount: number
): number => {
  if (salary === 0) return 0;
  return (annualAmount / salary) * 100;
};

/**
 * Validate contribution input
 * 
 * TODO: Add IRS contribution limits validation
 * - 401(k) annual contribution limits (e.g., $23,000 for 2024)
 * - Catch-up contributions for age 50+
 * - Highly compensated employee (HCE) limits
 * - These limits are not currently implemented
 */
export const validateContribution = (
  input: ContributionInput,
  currentAge?: number,
  retirementAge?: number
): { valid: boolean; error?: string } => {
  // Validate salary
  if (input.salary <= 0) {
    return { valid: false, error: "Salary must be greater than 0" };
  }

  // Validate contribution amount based on type
  if (input.contributionType === "percentage") {
    if (input.contributionAmount < 0 || input.contributionAmount > 100) {
      return {
        valid: false,
        error: "Contribution percentage must be between 0 and 100",
      };
    }
  } else {
    if (input.contributionAmount < 0) {
      return { valid: false, error: "Contribution amount must be positive" };
    }
  }

  // Validate retirement age if provided
  if (currentAge !== undefined && retirementAge !== undefined) {
    if (retirementAge <= currentAge) {
      return {
        valid: false,
        error: "Retirement age must be greater than current age",
      };
    }
  }

  return { valid: true };
};
