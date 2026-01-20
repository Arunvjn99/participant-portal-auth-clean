import { DashboardCard } from "../dashboard/DashboardCard";
import type { PlanRecommendation } from "../../types/enrollment";

interface RecommendationInsightCardProps {
  recommendation: PlanRecommendation;
  onReadFullAnalysis?: () => void;
}

/**
 * RecommendationInsightCard - Reusable component for displaying recommendation explanation
 */
export const RecommendationInsightCard = ({ recommendation, onReadFullAnalysis }: RecommendationInsightCardProps) => {
  // Use existing copy from recommendation rationale
  const fiduciaryExplanation = recommendation.rationale;

  return (
    <DashboardCard>
      <div className="recommendation-insight-card">
        <h3 className="recommendation-insight-card__title">Why we recommend Roth</h3>
        <p className="recommendation-insight-card__explanation">{fiduciaryExplanation}</p>
        {onReadFullAnalysis && (
          <button
            type="button"
            onClick={onReadFullAnalysis}
            className="recommendation-insight-card__link"
          >
            Read full analysis →
          </button>
        )}
      </div>
    </DashboardCard>
  );
};
