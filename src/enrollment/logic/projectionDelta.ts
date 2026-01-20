import type { ProjectionResult } from "./types";

/**
 * Calculate the difference between two projections
 * 
 * @param baseline Baseline projection (no auto-increase)
 * @param withAutoIncrease Projection with auto-increase applied
 * @returns Delta amount and percentage difference
 */
export const getProjectionDelta = (
  baseline: ProjectionResult,
  withAutoIncrease: ProjectionResult
): {
  deltaAmount: number;
  deltaPercentage: number;
} => {
  const deltaAmount = withAutoIncrease.finalBalance - baseline.finalBalance;
  
  // Calculate percentage increase
  const deltaPercentage =
    baseline.finalBalance > 0
      ? (deltaAmount / baseline.finalBalance) * 100
      : 0;

  return {
    deltaAmount,
    deltaPercentage,
  };
};
