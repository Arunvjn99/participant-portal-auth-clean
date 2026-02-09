import { DashboardCard } from "../dashboard/DashboardCard";
import Button from "../ui/Button";

interface PlanSelectionCardProps {
  planId: string;
  planName: string;
  description: string;
  matchInfo: string;
  benefits: string[];
  isRecommended?: boolean;
  fitPercentage?: number;
  isSelected?: boolean;
  onSelect: () => void;
}

/**
 * Best Fit card - static "System Recommendation" treatment:
 * - Recommendation header band
 * - Left accent bar
 * - Increased padding and elevation
 * - Stronger content hierarchy
 * - Primary CTA: "Continue with this plan"
 */
function BestFitCard({
  isSelected,
  children,
}: {
  isSelected: boolean;
  children: React.ReactNode;
}) {
  const baseClasses = `relative overflow-hidden rounded-xl border focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:ring-offset-2 ${
    isSelected
      ? "border-[#3b82f6] bg-[rgba(59,130,246,0.04)] shadow-[0_4px_6px_-2px_rgba(0,0,0,0.1),0_6px_12px_0_rgba(0,0,0,0.08)] dark:border-blue-500 dark:bg-[rgba(59,130,246,0.08)]"
      : "border-emerald-200/80 bg-white dark:border-emerald-700/50 dark:bg-slate-900 shadow-[var(--shadow-lg)]"
  }`;

  return (
    <article className={baseClasses}>
      {/* Spotlight background layer - behind content, 5–10% intensity */}
      {!isSelected && (
        <>
          <div
            className="plan-selection-card__spotlight-bg absolute inset-0 rounded-xl pointer-events-none"
            aria-hidden
          />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </article>
  );
}

/**
 * PlanSelectionCard - Best Fit: system recommendation treatment.
 * Other plans: de-emphasized secondary options.
 */
export const PlanSelectionCard = ({
  planId,
  planName,
  description,
  matchInfo,
  benefits,
  isRecommended = false,
  fitPercentage,
  isSelected = false,
  onSelect,
}: PlanSelectionCardProps) => {
  const cardContent = (
    <div
      className={`plan-selection-card ${isRecommended ? "plan-selection-card--recommended" : "plan-selection-card--standard"} ${isSelected ? "plan-selection-card--selected" : ""}`}
      role="option"
      aria-selected={isSelected}
      aria-label={`${planName}${isRecommended ? ", Recommended" : ""}`}
    >
      {isRecommended ? (
        <>
          {/* Step 1: System recommendation indicator - top-left pill */}
          <div className="plan-selection-card__spotlight-indicator">
            <span className="plan-selection-card__spotlight-indicator-text">
              Best Fit
            </span>
          </div>

          {/* Step 2: Content with clear grouping */}
          <div className="plan-selection-card__body plan-selection-card__body--recommended">
            <div className="plan-selection-card__content">
              {/* Title + recommendation + fit score */}
              <div className="plan-selection-card__header">
                <div className="plan-selection-card__header-left">
                  <h3 className="plan-selection-card__title plan-selection-card__title--recommended">
                    {planName}
                  </h3>
                  <p className="plan-selection-card__recommendation-label">
                    Recommended for you
                  </p>
                  {fitPercentage !== undefined && (
                    <div
                      className="plan-selection-card__badge mt-2 flex flex-col gap-1"
                      role="status"
                      aria-label={`${fitPercentage}% fit, recommended`}
                    >
                      <span className="plan-selection-card__badge-fit">
                        {fitPercentage}% Fit
                      </span>
                      <span className="plan-selection-card__badge-hint">
                        Based on your input
                      </span>
                    </div>
                  )}
                </div>
                <div className="plan-selection-card__header-action">
                  {isSelected ? (
                    <span
                      className="plan-selection-card__button plan-selection-card__button--selected"
                      aria-live="polite"
                    >
                      <svg
                        className="plan-selection-card__button-check"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M16 6l-8 8-4-4" />
                      </svg>
                      Selected
                    </span>
                  ) : (
                    <Button
                      onClick={onSelect}
                      className="plan-selection-card__button plan-selection-card__button--primary"
                      aria-label={`Continue with ${planName}`}
                    >
                      Continue with this plan
                    </Button>
                  )}
                </div>
              </div>

              {/* Value statement */}
              <p className="plan-selection-card__value-prop">{matchInfo}</p>

              {/* Detailed explanation */}
              <p className="plan-selection-card__description">{description}</p>

              {/* Benefit chips */}
              {benefits.length > 0 && (
                <div className="plan-selection-card__benefits">
                  {benefits.map((benefit, index) => (
                    <span
                      key={index}
                      className="plan-selection-card__benefit-chip plan-selection-card__benefit-chip--recommended"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="plan-selection-card__header">
            <div className="plan-selection-card__header-left">
              <h3 className="plan-selection-card__title">{planName}</h3>
            </div>
            <div className="plan-selection-card__header-action">
              {isSelected ? (
                <span
                  className="plan-selection-card__button plan-selection-card__button--selected"
                  aria-live="polite"
                >
                  <svg
                    className="plan-selection-card__button-check"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M16 6l-8 8-4-4" />
                  </svg>
                  Selected
                </span>
              ) : (
                <Button
                  onClick={onSelect}
                  className="plan-selection-card__button plan-selection-card__button--secondary"
                  aria-label={`Select ${planName}`}
                >
                  Select Plan
                </Button>
              )}
            </div>
          </div>
          <p className="plan-selection-card__match-info">{matchInfo}</p>
          <p className="plan-selection-card__description">{description}</p>
          {benefits.length > 0 && (
            <div className="plan-selection-card__benefits">
              {benefits.map((benefit, index) => (
                <span
                  key={index}
                  className="plan-selection-card__benefit-chip"
                >
                  {benefit}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  if (isRecommended) {
    return (
      <BestFitCard isSelected={isSelected}>
        <div className="text-slate-700 dark:text-slate-300">{cardContent}</div>
      </BestFitCard>
    );
  }

  const standardWrapperClass = isSelected
    ? "plan-selection-card--standard-wrapper p-5 md:p-6"
    : "plan-selection-card--standard-wrapper border-slate-200 bg-white p-5 md:p-6 dark:border-slate-600 dark:bg-slate-800";

  return (
    <DashboardCard isSelected={isSelected} className={standardWrapperClass}>
      {cardContent}
    </DashboardCard>
  );
};
