import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { useEnrollment } from "../../enrollment/context/EnrollmentContext";
import { EnrollmentStepper } from "../../components/enrollment/EnrollmentStepper";
import { PlanSelectionCard } from "../../components/enrollment/PlanSelectionCard";
import { ProfileSummaryCard } from "../../components/enrollment/ProfileSummaryCard";
import { RecommendationInsightCard } from "../../components/enrollment/RecommendationInsightCard";
import Button from "../../components/ui/Button";
import type { PlanRecommendation, PlanOption } from "../../types/enrollment";
import type { SelectedPlanId } from "../../enrollment/context/EnrollmentContext";

// Map plan IDs from ChoosePlan to normalized enum values
const normalizePlanId = (planId: string): SelectedPlanId => {
  const mapping: Record<string, SelectedPlanId> = {
    "traditional-401k": "traditional_401k",
    "roth-401k": "roth_401k",
    "roth-ira": "roth_ira",
  };
  return mapping[planId] || null;
};

// Mock data - will be replaced with API call later
const MOCK_RECOMMENDATION: PlanRecommendation = {
  recommendedPlanId: "roth-401k",
  fitScore: 85,
  rationale:
    "Based on your age and risk tolerance, a Roth 401(k) offers tax-free growth that aligns with your long-term retirement goals.",
  profileSnapshot: {
    age: 30,
    retirementAge: 65,
    salary: 75000,
    riskLevel: "Moderate",
  },
};


const MOCK_PLANS: PlanOption[] = [
  {
    id: "traditional-401k",
    title: "Traditional 401(k)",
    matchInfo: "Tax-deferred contributions",
    description:
      "Contributions are made with pre-tax dollars, reducing your taxable income now. You'll pay taxes when you withdraw in retirement.",
    benefits: ["Immediate tax savings", "Lower taxable income", "Employer match eligible"],
    isRecommended: false,
  },
  {
    id: "roth-401k",
    title: "Roth 401(k)",
    matchInfo: "Tax-free growth",
    description:
      "Contributions are made with after-tax dollars. Your investments grow tax-free, and qualified withdrawals in retirement are tax-free.",
    benefits: ["Tax-free withdrawals", "No RMDs before 59½", "Ideal for long-term growth"],
    isRecommended: true,
    fitScore: 85,
  },
  {
    id: "roth-ira",
    title: "Roth IRA",
    matchInfo: "Individual retirement account",
    description:
      "An individual retirement account with tax-free growth and withdrawals. Contribution limits apply based on income.",
    benefits: ["Flexible withdrawals", "No employer required", "Tax-free growth"],
    isRecommended: false,
  },
];

export const ChoosePlan = () => {
  const navigate = useNavigate();
  const { setSelectedPlan } = useEnrollment();
  const recommendation = MOCK_RECOMMENDATION;
  const plans = MOCK_PLANS.map((plan) => {
    const isRecommended = plan.id === recommendation.recommendedPlanId;
    return {
      ...plan,
      isRecommended,
      fitScore: isRecommended ? recommendation.fitScore : undefined,
    };
  });

  const handlePlanSelect = (planId: string) => {
    // Normalize and set plan in enrollment state
    const normalizedPlanId = normalizePlanId(planId);
    setSelectedPlan(normalizedPlanId);
    // Navigate to contribution page
    navigate("/enrollment/contribution");
  };

  const handleReadFullAnalysis = () => {
    // TODO: Handle read full analysis
    console.log("Read full analysis");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="choose-plan">
        {/* Enrollment Stepper */}
        <div className="choose-plan__stepper">
          <EnrollmentStepper currentStep={0} />
        </div>

        <div className="choose-plan__back">
          <Button
            onClick={handleBack}
            className="choose-plan__back-button"
            type="button"
            aria-label="Go back"
          >
            <span className="choose-plan__back-icon" aria-hidden="true">←</span>
            <span>Back</span>
          </Button>
        </div>
        <div className="choose-plan__header">
          <h1 className="choose-plan__title">Choose your plan</h1>
          <p className="choose-plan__subtitle">
            Based on your personalized information, we've recommended a plan that fits your needs.
          </p>
        </div>
        <div className="choose-plan__content">
          <div className="choose-plan__left">
            <div className="choose-plan__plans">
              {plans.map((plan) => (
                <PlanSelectionCard
                  key={plan.id}
                  planName={plan.title}
                  description={plan.description}
                  matchInfo={plan.matchInfo}
                  benefits={plan.benefits.slice(0, 3)}
                  isRecommended={plan.isRecommended}
                  fitPercentage={plan.fitScore}
                  onSelect={() => handlePlanSelect(plan.id)}
                />
              ))}
            </div>
          </div>
          <div className="choose-plan__right">
            <RecommendationInsightCard
              recommendation={recommendation}
              onReadFullAnalysis={handleReadFullAnalysis}
            />
            <ProfileSummaryCard
              age={recommendation.profileSnapshot.age}
              retirementAge={recommendation.profileSnapshot.retirementAge}
              salary={recommendation.profileSnapshot.salary}
              riskLevel={recommendation.profileSnapshot.riskLevel}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
