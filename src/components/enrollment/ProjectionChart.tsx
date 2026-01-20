import { DashboardCard } from "../dashboard/DashboardCard";
import type { ProjectionComparison } from "../../enrollment/logic/types";

interface ProjectionChartProps {
  projectionData: ProjectionComparison;
  currentAge: number;
  retirementAge: number;
}

export const ProjectionChart = ({
  projectionData,
  currentAge,
  retirementAge,
}: ProjectionChartProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate projected balance (use baseline or with auto-increase)
  const projectedBalance = projectionData.withAutoIncrease.finalBalance;

  return (
    <DashboardCard>
      <div className="projection-chart">
        <h3 className="projection-chart__title">Retirement Projection</h3>
        <div className="projection-chart__summary">
          <p className="projection-chart__summary-text">
            At this rate, you could have <strong>{formatCurrency(projectedBalance)}</strong> by retirement
          </p>
        </div>
        <p className="projection-chart__description">
          Projected balance at retirement: {currentAge} to {retirementAge}
        </p>
        <p className="projection-chart__caption">
          Estimates only. You're on track.
        </p>
        <div className="projection-chart__legend">
          <div className="projection-chart__legend-item">
            <span className="projection-chart__legend-line projection-chart__legend-line--employee" aria-hidden="true" />
            <span className="projection-chart__legend-label">Employee Contribution</span>
          </div>
          <div className="projection-chart__legend-item">
            <span className="projection-chart__legend-line projection-chart__legend-line--employer" aria-hidden="true" />
            <span className="projection-chart__legend-label">Employer Match</span>
          </div>
          <div className="projection-chart__legend-item">
            <span className="projection-chart__legend-line projection-chart__legend-line--auto-increase" aria-hidden="true" />
            <span className="projection-chart__legend-label">Auto-Increase Delta</span>
          </div>
        </div>
        <div className="projection-chart__container">
          {/* TODO: Implement chart visualization using projectionData.baseline.dataPoints and projectionData.withAutoIncrease.dataPoints */}
          <div className="projection-chart__placeholder">
            <div className="projection-chart__summary">
              <div className="projection-chart__summary-item">
                <span className="projection-chart__summary-label">Current Contribution</span>
                <span className="projection-chart__summary-value">
                  {formatCurrency(projectionData.baseline.finalBalance)}
                </span>
              </div>
              <div className="projection-chart__summary-item">
                <span className="projection-chart__summary-label">With Auto-Increase</span>
                <span className="projection-chart__summary-value">
                  {formatCurrency(projectionData.withAutoIncrease.finalBalance)}
                </span>
              </div>
            </div>
            <p className="projection-chart__placeholder-text">
              Chart visualization will be implemented here
            </p>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};
