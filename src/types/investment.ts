/**
 * Investment type definitions
 */

export type InvestmentStrategy = "planDefault" | "manual" | "advisor";

export interface Fund {
  id: string;
  name: string;
  ticker: string;
  assetClass: AssetClass;
  expenseRatio: number; // e.g., 0.05 = 0.05%
  riskLevel: RiskLevel;
  expectedReturn: number; // e.g., 7.5 = 7.5% annual return
  description?: string;
}

export type AssetClass =
  | "US Large Cap"
  | "US Mid Cap"
  | "US Small Cap"
  | "International"
  | "Bonds"
  | "Real Estate"
  | "Cash";

export type RiskLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Allocation {
  fundId: string;
  percentage: number; // 0-100
}

export interface AllocationState {
  allocations: Allocation[];
  isValid: boolean;
  total: number;
  expectedReturn: number;
  totalFees: number;
  riskLevel: number;
}

export interface PlanDefaultPortfolio {
  name: string;
  description: string;
  allocations: Allocation[];
  expectedReturn: number;
  totalFees: number;
  riskLevel: number;
}
