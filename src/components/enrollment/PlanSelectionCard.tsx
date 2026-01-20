import { DashboardCard } from "../dashboard/DashboardCard";
import Button from "../ui/Button";

interface PlanSelectionCardProps {
  planName: string;
  description: string;
  matchInfo: string;
  benefits: string[];
  isRecommended?: boolean;
  fitPercentage?: number;
  onSelect: () => void;
}

/**
 * PlanSelectionCard - Reusable component for displaying plan options
 * Only ONE plan can be visually highlighted (recommended plan)
 */
export const PlanSelectionCard = ({
  planName,
  description,
  matchInfo,
  benefits,
  isRecommended = false,
  fitPercentage,
  onSelect,
}: PlanSelectionCardProps) => {
  return (
    <DashboardCard isRecommended={isRecommended}>
      <div className={`plan-selection-card ${isRecommended ? "plan-selection-card--recommended" : "plan-selection-card--standard"}`}>
        <div className="plan-selection-card__header">
          <h3 className="plan-selection-card__title">{planName}</h3>
          {isRecommended && fitPercentage !== undefined && (
            <div className="plan-selection-card__badge" role="status" aria-label={`Recommended - Strong alignment with your profile`}>
              <span className="plan-selection-card__badge-primary">Recommended</span>
              <span className="plan-selection-card__badge-separator">·</span>
              <span className="plan-selection-card__badge-secondary">Strong alignment with your profile</span>
              <span className="plan-selection-card__badge-percentage">{fitPercentage}%</span>
            </div>
          )}
        </div>
        <p className="plan-selection-card__description">{description}</p>
        <p className="plan-selection-card__match-info">{matchInfo}</p>
        {benefits.length > 0 && (
          <div className="plan-selection-card__benefits">
            {benefits.map((benefit, index) => (
              <span key={index} className="plan-selection-card__benefit-chip">
                {benefit}
              </span>
            ))}
          </div>
        )}
        <div className="plan-selection-card__action">
          <Button
            onClick={onSelect}
            className="plan-selection-card__button plan-selection-card__button--primary"
          >
            Select Plan
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
};
