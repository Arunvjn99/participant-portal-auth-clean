/**
 * Post-enrollment dashboard data (matches Figma 519-4705)
 * Data flow: selectedPlan, enrollment, account, performance, confirmed allocation
 */

export interface PostEnrollmentPlan {
  planId: string;
  planName: string;
  planType: string;
  enrolledAt: string; // ISO date
  totalBalance: number;
  ytdReturn: number; // percentage
  employerMatchPct: number; // e.g. 92 for 92%
  contributionRate: number; // e.g. 12 for 12%
}

export interface PostEnrollmentBalances {
  rolloverEligible: number;
  availableCash: number; // est. after taxes/penalties
  restricted: number;
}

export interface PostEnrollmentPortfolioRow {
  fundId: string;
  fundName: string;
  ticker: string;
  balance: number;
  allocationPct: number;
  returnPct: number; // YTD or period return
}

export interface PostEnrollmentGoalSimulator {
  percentOnTrack: number;
  retirementAge: number;
  monthlyContribution: number;
  projectedBalance: number;
  currentAge: number;
  salary?: number;
}

export interface SmartNudge {
  id: string;
  title: string;
  insight: string;
  actionLabel: string;
  actionRoute: string;
}

export interface PostEnrollmentDashboardData {
  plan: PostEnrollmentPlan;
  balances: PostEnrollmentBalances;
  portfolio: PostEnrollmentPortfolioRow[];
  goalSimulator: PostEnrollmentGoalSimulator;
  allocationDescription: string;
  smartNudges: SmartNudge[];
  topBanner: {
    percentOnTrack: number;
    subText: string;
    actionRoute: string;
  };
  isWithdrawalRestricted: boolean;
}

export const MOCK_POST_ENROLLMENT: PostEnrollmentDashboardData = {
  plan: {
    planId: "plan-1",
    planName: "TechVantage 401(k) Retirement Plan",
    planType: "401(k)",
    enrolledAt: "2018-05-15",
    totalBalance: 234992,
    ytdReturn: 12.4,
    employerMatchPct: 92,
    contributionRate: 12,
  },
  balances: {
    rolloverEligible: 207992,
    availableCash: 187192.8,
    restricted: 27000,
  },
  portfolio: [
    { fundId: "fund-1", fundName: "Vanguard 500 Index Fund", ticker: "VINIX", balance: 98500, allocationPct: 42, returnPct: 14.2 },
    { fundId: "fund-2", fundName: "Fidelity Total Market Index", ticker: "FSMKX", balance: 62000, allocationPct: 26, returnPct: 13.8 },
    { fundId: "fund-5", fundName: "International Growth Fund", ticker: "RERGX", balance: 38000, allocationPct: 16, returnPct: -2.1 },
    { fundId: "fund-7", fundName: "Bond Market Index Fund", ticker: "VBTLX", balance: 36492, allocationPct: 16, returnPct: 3.2 },
  ],
  goalSimulator: {
    percentOnTrack: 90,
    retirementAge: 65,
    monthlyContribution: 1200,
    projectedBalance: 2256000,
    currentAge: 31,
    salary: 85000,
  },
  allocationDescription: "Based on your age (31) and risk profile, this growth-focused mix aims to maximize returns while managing volatility.",
  smartNudges: [
    {
      id: "nudge-1",
      title: "Maximize your match",
      insight: "You're currently contributing 12%. Increasing to 13% would secure an additional $1,240/year in employer matching.",
      actionLabel: "Increase to 13%",
      actionRoute: "/enrollment/contribution",
    },
    {
      id: "nudge-2",
      title: "The power of patience",
      insight: "Delaying retirement by just 2 years to age 67 would add an estimated $162,000 to your final balance.",
      actionLabel: "See Projection",
      actionRoute: "/investments",
    },
  ],
  topBanner: {
    percentOnTrack: 72,
    subText: "Increase your contribution by 2% to reach 100% confidence.",
    actionRoute: "/enrollment/contribution",
  },
  isWithdrawalRestricted: false,
};
