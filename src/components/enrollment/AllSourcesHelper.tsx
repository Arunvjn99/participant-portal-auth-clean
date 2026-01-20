import { DashboardCard } from "../dashboard/DashboardCard";

/**
 * AllSourcesHelper - Explanatory helper text for "All sources" mode
 */
export const AllSourcesHelper = () => {
  return (
    <DashboardCard>
      <div className="all-sources-helper">
        <h4 className="all-sources-helper__title">System Optimized Allocation</h4>
        <p className="all-sources-helper__description">
          When you select "All sources," our system automatically optimizes your contribution allocation across pre-tax, Roth, and after-tax sources based on:
        </p>
        <ul className="all-sources-helper__list">
          <li>Your current tax bracket</li>
          <li>Projected retirement tax bracket</li>
          <li>Plan rules and contribution limits</li>
          <li>Your retirement timeline</li>
        </ul>
        <p className="all-sources-helper__note">
          This allocation will be automatically adjusted as your financial situation changes.
        </p>
      </div>
    </DashboardCard>
  );
};
