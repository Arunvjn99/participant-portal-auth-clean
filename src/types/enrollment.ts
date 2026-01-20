export interface PlanRecommendation {
  recommendedPlanId: string;
  fitScore: number;
  rationale: string;
  profileSnapshot: {
    age: number;
    retirementAge: number;
    salary: number;
    riskLevel: string;
  };
}

export interface PlanOption {
  id: string;
  title: string;
  matchInfo: string;
  description: string;
  benefits: string[];
  isRecommended?: boolean;
  fitScore?: number;
}
