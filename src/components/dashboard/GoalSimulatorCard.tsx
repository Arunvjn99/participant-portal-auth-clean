import type { PostEnrollmentGoalSimulator } from "../../data/postEnrollmentDashboard";

interface GoalSimulatorCardProps {
  data: PostEnrollmentGoalSimulator;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

/**
 * Goal Simulator - circular progress, metrics, Save Sim / Load Saved.
 * READ-ONLY: no sliders, no edit toggles.
 */
export const GoalSimulatorCard = ({ data }: GoalSimulatorCardProps) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (data.percentOnTrack / 100) * circumference;

  return (
    <article className="ped-goal">
      <h2 className="ped-goal__title">Goal Simulator</h2>
      <div className="ped-goal__ring-wrap">
        <svg className="ped-goal__ring" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--accent-primary, var(--color-primary))"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
            strokeLinecap="round"
          />
        </svg>
        <div className="ped-goal__center">
          <span className="ped-goal__center-val">{data.percentOnTrack}%</span>
          <span className="ped-goal__center-label">On Track</span>
        </div>
      </div>
      <div className="ped-goal__row">
        <span className="ped-goal__label">Retirement Age</span>
        <span className="ped-goal__value">{data.retirementAge}</span>
      </div>
      <div className="ped-goal__row">
        <span className="ped-goal__label">Monthly Contribution</span>
        <span className="ped-goal__value">{formatCurrency(data.monthlyContribution)}</span>
      </div>
      <div className="ped-goal__actions">
        <button type="button" className="ped-goal__btn ped-goal__btn--outline">
          Save Sim
        </button>
        <button type="button" className="ped-goal__btn ped-goal__btn--outline">
          Load Saved
        </button>
      </div>
      <div className="ped-goal__projected">
        <span className="ped-goal__projected-value">{formatCurrency(data.projectedBalance)}</span>
        <span className="ped-goal__projected-label">at age {data.retirementAge}</span>
      </div>
    </article>
  );
};
