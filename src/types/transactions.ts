/**
 * Transaction types and status definitions
 */

export type TransactionType = "loan" | "withdrawal" | "distribution" | "rollover" | "transfer" | "rebalance";

export type TransactionStatus = "draft" | "active" | "completed" | "cancelled";

export type RetirementImpactLevel = "low" | "medium" | "high";

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  grossAmount?: number;
  netAmount?: number;
  fees?: number;
  taxWithholding?: number;
  dateInitiated: string;
  dateCompleted?: string;
  processingTime?: string;
  repaymentInfo?: {
    monthlyPayment: number;
    termMonths: number;
    interestRate: number;
  };
  milestones?: {
    submitted?: string;
    processing?: string;
    completed?: string;
  };
  retirementImpact: {
    level: RetirementImpactLevel;
    rationale: string;
  };
  isIrreversible: boolean;
  legalConfirmations: string[];
}
