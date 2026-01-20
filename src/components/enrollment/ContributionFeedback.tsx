import { DashboardCard } from "../dashboard/DashboardCard";

interface ContributionFeedbackProps {
  contributionAmount: number;
  contributionType: "percentage" | "fixed";
  matchCap: number;
  matchPercentage: number;
}

/**
 * ContributionFeedback - Immediate feedback messages
 * Shows reassurance and guidance based on contribution amount
 */
export const ContributionFeedback = ({
  contributionAmount,
  contributionType,
  matchCap,
  matchPercentage,
}: ContributionFeedbackProps) => {
  // Calculate if meets employer match
  const meetsMatch = contributionType === "percentage" && contributionAmount >= matchCap;
  const belowRecommended = contributionType === "percentage" && contributionAmount < 10;

  return (
    <DashboardCard>
      <div className="contribution-feedback">
        {meetsMatch && (
          <div className="contribution-feedback__message contribution-feedback__message--success">
            <span className="contribution-feedback__icon" aria-hidden="true">✓</span>
            <span className="contribution-feedback__text">Meets employer match</span>
          </div>
        )}
        {belowRecommended && !meetsMatch && (
          <div className="contribution-feedback__message contribution-feedback__message--warning">
            <span className="contribution-feedback__icon" aria-hidden="true">ℹ</span>
            <span className="contribution-feedback__text">Below recommended (10% or more)</span>
          </div>
        )}
        <div className="contribution-feedback__reassurance">
          <span className="contribution-feedback__reassurance-text">You can change this anytime</span>
        </div>
      </div>
    </DashboardCard>
  );
};
