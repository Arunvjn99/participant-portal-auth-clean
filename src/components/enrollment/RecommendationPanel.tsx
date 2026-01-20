import { DashboardCard } from "../dashboard/DashboardCard";

interface RecommendationPanelProps {
  rationale: string;
  age: number;
  riskLevel: string;
  onReadFullAnalysis?: () => void;
}

export const RecommendationPanel = ({
  rationale,
  age,
  riskLevel,
  onReadFullAnalysis,
}: RecommendationPanelProps) => {
  return (
    <DashboardCard>
      <div className="recommendation-panel">
        <h3 className="recommendation-panel__title">Why this plan?</h3>
        <p className="recommendation-panel__rationale">{rationale}</p>
        <div className="recommendation-panel__factors">
          <div className="recommendation-panel__factor">
            <span className="recommendation-panel__factor-label">Age:</span>
            <span className="recommendation-panel__factor-value">{age}</span>
          </div>
          <div className="recommendation-panel__factor">
            <span className="recommendation-panel__factor-label">Risk:</span>
            <span className="recommendation-panel__factor-value">{riskLevel}</span>
          </div>
        </div>
        {onReadFullAnalysis && (
          <a
            href="#"
            className="recommendation-panel__link"
            onClick={(e) => {
              e.preventDefault();
              onReadFullAnalysis();
            }}
          >
            Read full analysis
          </a>
        )}
      </div>
    </DashboardCard>
  );
};
