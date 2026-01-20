import { DashboardCard } from "../dashboard/DashboardCard";

interface AllSourcesToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

/**
 * AllSourcesToggle - Top-level toggle for "Use all sources automatically"
 */
export const AllSourcesToggle = ({ enabled, onToggle }: AllSourcesToggleProps) => {
  return (
    <DashboardCard>
      <div className="all-sources-toggle">
        <div className="all-sources-toggle__header">
          <div className="all-sources-toggle__content">
            <h3 className="all-sources-toggle__title">Use all sources automatically</h3>
            <p className="all-sources-toggle__description">
              Let the system optimize your contribution allocation across all available sources based on your financial profile.
            </p>
          </div>
          <label className="all-sources-toggle__switch">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onToggle(e.target.checked)}
              className="all-sources-toggle__input"
              aria-label="Use all sources automatically"
            />
            <span className="all-sources-toggle__slider" aria-hidden="true"></span>
          </label>
        </div>
        {enabled && (
          <div className="all-sources-toggle__helper">
            <p className="all-sources-toggle__helper-text">
              Your contribution will be automatically allocated across pre-tax, Roth, and after-tax sources based on your current tax bracket, projected retirement tax bracket, and plan rules. This allocation will be adjusted automatically as your financial situation changes.
            </p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};
