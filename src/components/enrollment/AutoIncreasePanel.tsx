import { DashboardCard } from "../dashboard/DashboardCard";
import type { AutoIncreaseSettings } from "../../enrollment/logic/types";

interface AutoIncreasePanelProps {
  autoIncrease: AutoIncreaseSettings;
  onSettingsChange: (settings: AutoIncreaseSettings) => void;
  deltaAmount?: number;
}

export const AutoIncreasePanel = ({
  autoIncrease,
  onSettingsChange,
  deltaAmount,
}: AutoIncreasePanelProps) => {
  const handleToggle = () => {
    onSettingsChange({
      ...autoIncrease,
      enabled: !autoIncrease.enabled,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardCard>
      <div className="auto-increase-panel">
        <h3 className="auto-increase-panel__title">Automatic Increase</h3>
        <p className="auto-increase-panel__description">
          Optionally set up automatic annual increases to your contribution rate. This affects future projections only, not your current monthly contribution.
        </p>
        <div className="auto-increase-panel__toggle">
          <label className="auto-increase-panel__toggle-label">
            <input
              type="checkbox"
              checked={autoIncrease.enabled}
              onChange={handleToggle}
              className="auto-increase-panel__toggle-input"
              aria-label="Enable automatic contribution increase"
            />
            <span className="auto-increase-panel__toggle-text">
              Enable automatic annual increase
            </span>
          </label>
        </div>
        {autoIncrease.enabled && (
          <div className="auto-increase-panel__settings">
            <div className="auto-increase-panel__input-group">
              <label htmlFor="auto-increase-percentage" className="auto-increase-panel__input-label">
                Annual increase percentage
              </label>
              <input
                id="auto-increase-percentage"
                type="number"
                min="0.5"
                max="5"
                step="0.5"
                value={autoIncrease.percentage}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  onSettingsChange({
                    ...autoIncrease,
                    percentage: Math.max(0.5, Math.min(5, value)),
                  });
                }}
                className="auto-increase-panel__input"
              />
              <span className="auto-increase-panel__input-suffix">%</span>
            </div>
            <p className="auto-increase-panel__settings-note">
              Your contribution will increase by {autoIncrease.percentage}% each year, up to a maximum of {autoIncrease.maxPercentage}% of your salary.
            </p>
            {deltaAmount !== undefined && deltaAmount > 0 && (
              <p className="auto-increase-panel__delta-message" role="status" aria-live="polite">
                This could add approximately {formatCurrency(deltaAmount)} to your retirement savings over time.
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardCard>
  );
};
