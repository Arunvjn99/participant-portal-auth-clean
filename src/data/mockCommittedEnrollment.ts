/**
 * Mock data for committed enrollment (post-enrollment state)
 * This represents enrollment data after successful enrollment submission
 */

export interface CommittedEnrollment {
  enrollmentDate: string; // ISO date string
  enrolledPlans: Array<{
    planId: string;
    planName: string;
    planType: string;
    balance: number;
    vestedBalance: number;
    vestingPercentage: number;
    contributionPercentage: number;
    employerMatchUtilization: number; // 0-100%
    investmentRiskLevel: number; // 1-10
    investmentRiskLabel: string;
    lastContributionDate: string;
  }>;
  totalBalance: number;
  totalVestedBalance: number;
  retirementGoal: {
    targetAmount: number;
    currentProgress: number; // percentage
    projectedBalance: number;
    replacementRate: number; // percentage
  };
  performance: {
    ytd: number; // percentage
    oneYear: number; // percentage
    allTime: number; // percentage
  };
  alerts: Array<{
    id: string;
    type: "beneficiary" | "contribution" | "auto-increase" | "action-required";
    title: string;
    message: string;
    actionLabel: string;
    actionRoute: string;
    priority: "high" | "medium" | "low";
  }>;
  recentTransactions: Array<{
    id: string;
    date: string;
    type: "contribution" | "employer-match" | "fee" | "dividend" | "rebalance";
    description: string;
    amount: number;
  }>;
}

export const MOCK_COMMITTED_ENROLLMENT: CommittedEnrollment = {
  enrollmentDate: "2024-01-15",
  enrolledPlans: [
    {
      planId: "plan-1",
      planName: "Roth 401(k)",
      planType: "Roth 401(k)",
      balance: 125000,
      vestedBalance: 125000,
      vestingPercentage: 100,
      contributionPercentage: 10,
      employerMatchUtilization: 100, // Getting full match
      investmentRiskLevel: 5,
      investmentRiskLabel: "Moderate",
      lastContributionDate: "2024-12-01",
    },
  ],
  totalBalance: 125000,
  totalVestedBalance: 125000,
  retirementGoal: {
    targetAmount: 2000000,
    currentProgress: 6.25, // 125k / 2M
    projectedBalance: 1850000,
    replacementRate: 75,
  },
  performance: {
    ytd: 8.5,
    oneYear: 12.3,
    allTime: 15.2,
  },
  alerts: [
    {
      id: "alert-1",
      type: "beneficiary",
      title: "Beneficiary not set",
      message: "Add a beneficiary to ensure your account is handled according to your wishes.",
      actionLabel: "Add beneficiary",
      actionRoute: "/enrollment/manage/plan-1",
      priority: "high",
    },
    {
      id: "alert-2",
      type: "auto-increase",
      title: "Auto-increase scheduled",
      message: "Your contribution will increase by 1% on January 1, 2025.",
      actionLabel: "Manage auto-increase",
      actionRoute: "/enrollment/manage/plan-1",
      priority: "medium",
    },
  ],
  recentTransactions: [
    {
      id: "txn-1",
      date: "2024-12-01",
      type: "contribution",
      description: "Employee contribution",
      amount: 625,
    },
    {
      id: "txn-2",
      date: "2024-12-01",
      type: "employer-match",
      description: "Employer match",
      amount: 312.5,
    },
    {
      id: "txn-3",
      date: "2024-11-15",
      type: "contribution",
      description: "Employee contribution",
      amount: 625,
    },
    {
      id: "txn-4",
      date: "2024-11-15",
      type: "employer-match",
      description: "Employer match",
      amount: 312.5,
    },
    {
      id: "txn-5",
      date: "2024-11-01",
      type: "dividend",
      description: "Quarterly dividend",
      amount: 125.5,
    },
    {
      id: "txn-6",
      date: "2024-10-15",
      type: "contribution",
      description: "Employee contribution",
      amount: 625,
    },
    {
      id: "txn-7",
      date: "2024-10-15",
      type: "employer-match",
      description: "Employer match",
      amount: 312.5,
    },
  ],
};
