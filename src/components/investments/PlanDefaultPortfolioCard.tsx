import { DashboardCard } from "../dashboard/DashboardCard";
import { ModerateInvestorChip } from "./ModerateInvestorChip";

/** Filter icon for header */
const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="18" cy="6" r="2" fill="currentColor" />
    <circle cx="6" cy="12" r="2" fill="currentColor" />
    <circle cx="14" cy="18" r="2" fill="currentColor" />
  </svg>
);

/**
 * Plan Default Portfolio card - Figma design
 * Shows recommended strategy with MODERATE INVESTOR badge, info banner, metrics.
 * Edit toggle moved to FUND ALLOCATION section (Figma 293-840).
 */
export const PlanDefaultPortfolioCard = () => {
  return (
    <DashboardCard>
      <div className="flex flex-col gap-4">
        {/* Header: icon | title block | filter - per Figma 293-777 */}
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="14" y="4" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="4" y="14" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="14" y="14" width="6" height="6" rx="1" fill="currentColor" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="m-0 text-xl font-semibold text-foreground">Plan Default Portfolio</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ModerateInvestorChip variant="badge">MODERATE INVESTOR</ModerateInvestorChip>
              <span className="text-sm text-muted-foreground">88% confidence</span>
            </div>
          </div>
          <button
            type="button"
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800 dark:hover:text-foreground"
            aria-label="Filter options"
          >
            <FilterIcon />
          </button>
        </div>

        {/* Info banner - light blue bg, info icon, dark blue text per Figma */}
        <div className="flex gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500 text-white dark:border-blue-400 dark:bg-blue-600">
            <span className="text-sm font-bold">i</span>
          </div>
          <p className="m-0 text-[0.9375em] leading-relaxed text-blue-900 dark:text-blue-100">
            Your balanced approach to risk and return indicates a moderate portfolio is ideal. A 60% stocks / 40% bonds allocation provides growth potential while maintaining stability, suitable for most investors with 10+ year horizons.
          </p>
        </div>
        {/* Metrics row */}
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">EXPECTED RETURN</span>
            <span className="font-semibold text-green-600 dark:text-green-400">6-8%</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">VOLATILITY RANGE</span>
            <span className="font-semibold text-foreground">Moderate (10-15%)</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">RISK LEVEL</span>
            <ModerateInvestorChip variant="pill">Medium</ModerateInvestorChip>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};
