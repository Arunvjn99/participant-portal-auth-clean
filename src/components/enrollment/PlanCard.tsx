import { DashboardCard } from "../dashboard/DashboardCard";
import Button from "../ui/Button";

interface PlanCardProps {
  planId: string;
  title: string;
  valueStatement: string;
  benefits: string[];
  isRecommended?: boolean;
  fitScore?: number;
  onSelect: () => void;
}

export const PlanCard = ({
  planId,
  title,
  valueStatement,
  benefits,
  isRecommended = false,
  fitScore,
  onSelect,
}: PlanCardProps) => {

  const getCTALabel = () => {
    if (isRecommended) {
      if (planId === "roth-401k") {
        return "Select Roth 401(k)";
      }
      return `Select ${title}`;
    }
    return "Select Plan";
  };

  return (
    <DashboardCard isRecommended={isRecommended}>
      <div className={`plan-card ${isRecommended ? "plan-card--recommended" : "plan-card--standard"}`}>
        <div className="plan-card__header">
          <div className="plan-card__title-row">
            {isRecommended && fitScore !== undefined && (
              <div className="plan-card__badge" role="status" aria-label={`Recommended - ${fitScore}% fit`}>
                <span className="plan-card__badge-text">Recommended</span>
                <span className="plan-card__badge-separator">•</span>
                <span className="plan-card__badge-text">{fitScore}% Fit</span>
              </div>
            )}
            <h3 className="plan-card__title">{title}</h3>
          </div>
          <p className="plan-card__value-statement">{valueStatement}</p>
        </div>
        {benefits.length > 0 && (
          <div className="plan-card__benefits">
            {benefits.map((benefit, index) => (
              <span key={index} className="plan-card__benefit-chip">
                {benefit}
              </span>
            ))}
          </div>
        )}
        <div className="plan-card__action">
          <Button
            onClick={onSelect}
            className={`plan-card__button ${isRecommended ? "plan-card__button--primary" : "plan-card__button--secondary"}`}
          >
            {getCTALabel()}
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
};
