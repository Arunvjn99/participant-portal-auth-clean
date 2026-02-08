import { useNavigate } from "react-router-dom";
import type { PostEnrollmentPlan, PostEnrollmentBalances } from "../../data/postEnrollmentDashboard";

interface PlanOverviewCardProps {
  plan: PostEnrollmentPlan;
  balances: PostEnrollmentBalances;
  isWithdrawalRestricted: boolean;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/**
 * Plan Overview Card with Quick Stats (Rollover Eligible, Available Cash, Restricted)
 */
export const PlanOverviewCard = ({
  plan,
  balances,
  isWithdrawalRestricted,
}: PlanOverviewCardProps) => {
  const navigate = useNavigate();

  return (
    <article className="ped-plan">
      <div className="ped-plan__header">
        <div className="ped-plan__meta">
          <span className="ped-plan__icon" aria-hidden>401(k)</span>
          <span className="ped-plan__enrolled">Enrolled: {formatDate(plan.enrolledAt)}</span>
        </div>
        <span className="ped-plan__match">{plan.employerMatchPct}% match</span>
      </div>
      <h2 className="ped-plan__name">{plan.planName}</h2>
      <div className="ped-plan__balance-section">
        <span className="ped-plan__balance-label">TOTAL BALANCE</span>
        <span className="ped-plan__balance-value">{formatCurrency(plan.totalBalance)}</span>
        <span className="ped-plan__ytd">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <polyline points="18 15 12 9 6 15" />
          </svg>
          +{plan.ytdReturn}% YTD
        </span>
      </div>
      <div className="ped-plan__stats">
        <div className="ped-plan__stat-card">
          <h3 className="ped-plan__stat-title">Rollover Eligible</h3>
          <p className="ped-plan__stat-desc">Move to IRA or new employer</p>
          <span className="ped-plan__stat-value">{formatCurrency(balances.rolloverEligible)}</span>
          <button
            type="button"
            className="ped-plan__stat-btn"
            onClick={() => navigate("/transactions/rollover/start")}
          >
            Start Rollover
          </button>
        </div>
        <div className="ped-plan__stat-card">
          <h3 className="ped-plan__stat-title">Available Cash</h3>
          <p className="ped-plan__stat-desc">Est. after taxes/penalties.</p>
          <span className="ped-plan__stat-value">~{formatCurrency(balances.availableCash)}</span>
          <button
            type="button"
            className="ped-plan__stat-btn"
            disabled={isWithdrawalRestricted}
            onClick={() => navigate("/transactions/withdrawal/start")}
          >
            Request Withdrawal
          </button>
        </div>
        <div className="ped-plan__stat-card">
          <h3 className="ped-plan__stat-title">Restricted</h3>
          <p className="ped-plan__stat-desc">Unvested employer funds</p>
          <span className="ped-plan__stat-value">{formatCurrency(balances.restricted)}</span>
          <span className="ped-plan__stat-status">Vesting over time</span>
        </div>
      </div>
    </article>
  );
};
