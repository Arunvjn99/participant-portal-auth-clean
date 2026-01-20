import type { Allocation, Fund, AllocationState } from "../types/investment";
import { MOCK_FUNDS } from "../data/mockFunds";

/**
 * Calculate total allocation percentage
 */
export const calculateTotalAllocation = (allocations: Allocation[]): number => {
  return allocations.reduce((sum, allocation) => sum + allocation.percentage, 0);
};

/**
 * Validate that allocation totals exactly 100%
 */
export const validateAllocation = (allocations: Allocation[]): boolean => {
  const total = calculateTotalAllocation(allocations);
  return Math.abs(total - 100) < 0.01; // Allow for floating point precision
};

/**
 * Calculate weighted expected return
 */
export const calculateExpectedReturn = (allocations: Allocation[]): number => {
  let totalReturn = 0;
  
  allocations.forEach((allocation) => {
    const fund = MOCK_FUNDS.find((f) => f.id === allocation.fundId);
    if (fund) {
      totalReturn += (allocation.percentage / 100) * fund.expectedReturn;
    }
  });
  
  return totalReturn;
};

/**
 * Calculate weighted total fees
 */
export const calculateTotalFees = (allocations: Allocation[]): number => {
  let totalFees = 0;
  
  allocations.forEach((allocation) => {
    const fund = MOCK_FUNDS.find((f) => f.id === allocation.fundId);
    if (fund) {
      totalFees += (allocation.percentage / 100) * fund.expenseRatio;
    }
  });
  
  return totalFees;
};

/**
 * Calculate weighted average risk level
 */
export const calculateRiskLevel = (allocations: Allocation[]): number => {
  let weightedRisk = 0;
  let totalPercentage = 0;
  
  allocations.forEach((allocation) => {
    if (allocation.percentage > 0) {
      const fund = MOCK_FUNDS.find((f) => f.id === allocation.fundId);
      if (fund) {
        weightedRisk += (allocation.percentage / 100) * fund.riskLevel;
        totalPercentage += allocation.percentage;
      }
    }
  });
  
  if (totalPercentage === 0) return 0;
  return weightedRisk / (totalPercentage / 100);
};

/**
 * Get complete allocation state
 */
export const getAllocationState = (allocations: Allocation[]): AllocationState => {
  const total = calculateTotalAllocation(allocations);
  const isValid = validateAllocation(allocations);
  
  return {
    allocations,
    isValid,
    total,
    expectedReturn: calculateExpectedReturn(allocations),
    totalFees: calculateTotalFees(allocations),
    riskLevel: calculateRiskLevel(allocations),
  };
};

/**
 * Normalize allocations to sum to 100%
 */
export const normalizeAllocations = (allocations: Allocation[]): Allocation[] => {
  const total = calculateTotalAllocation(allocations);
  if (total === 0) return allocations;
  
  return allocations.map((allocation) => ({
    ...allocation,
    percentage: (allocation.percentage / total) * 100,
  }));
};
