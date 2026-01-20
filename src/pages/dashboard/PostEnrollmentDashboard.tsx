import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { DashboardCard } from "../../components/dashboard/DashboardCard";
import { MOCK_COMMITTED_ENROLLMENT } from "../../data/mockCommittedEnrollment";
import Button from "../../components/ui/Button";

/**
 * PostEnrollmentDashboard - Read-only dashboard for enrolled participants
 * Shows status, progress, health, and routes to management actions
 */
export const PostEnrollmentDashboard = () => {
  const navigate = useNavigate();
  const enrollment = MOCK_COMMITTED_ENROLLMENT;

  // Calculate total balance across all plans
  const totalBalance = enrollment.totalBalance;
  const totalVestedBalance = enrollment.totalVestedBalance;

  // Get user greeting (mock - would come from user profile)
  const userName = "Participant"; // TODO: Get from user context
  const greeting = `Welcome back, ${userName}`;

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="post-enrollment-dashboard">
        {/* ZONE A — Status & Confidence (Top, full width) */}
        <div className="post-enrollment-dashboard__zone-a">
          <DashboardCard className="post-enrollment-dashboard__hero">
            <div className="post-enrollment-dashboard__hero-content">
              <div className="post-enrollment-dashboard__hero-header">
                <h1 className="post-enrollment-dashboard__greeting">{greeting}</h1>
                <span className="post-enrollment-dashboard__status-badge post-enrollment-dashboard__status-badge--enrolled">
                  Enrolled
                </span>
              </div>
              <div className="post-enrollment-dashboard__hero-balance">
                <div className="post-enrollment-dashboard__balance-item">
                  <span className="post-enrollment-dashboard__balance-label">Total Balance</span>
                  <span className="post-enrollment-dashboard__balance-value">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(totalBalance)}
                  </span>
                </div>
                <div className="post-enrollment-dashboard__balance-item">
                  <span className="post-enrollment-dashboard__balance-label">Vested Balance</span>
                  <span className="post-enrollment-dashboard__balance-value">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(totalVestedBalance)}
                  </span>
                </div>
              </div>
              <div className="post-enrollment-dashboard__hero-action">
                <Button
                  onClick={() => navigate("/enrollment")}
                  className="post-enrollment-dashboard__cta post-enrollment-dashboard__cta--primary"
                >
                  Manage Enrollment
                </Button>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="post-enrollment-dashboard__grid">
          {/* ZONE B — Enrolled Plans */}
          <div className="post-enrollment-dashboard__zone-b">
            <DashboardCard title="Enrolled Plans">
              <div className="post-enrollment-dashboard__plans">
                {enrollment.enrolledPlans.map((plan) => (
                  <div key={plan.planId} className="post-enrollment-dashboard__plan-card">
                    <div className="post-enrollment-dashboard__plan-header">
                      <div className="post-enrollment-dashboard__plan-info">
                        <h3 className="post-enrollment-dashboard__plan-name">{plan.planName}</h3>
                        <span className="post-enrollment-dashboard__plan-type">{plan.planType}</span>
                      </div>
                      <span className="post-enrollment-dashboard__plan-status-badge post-enrollment-dashboard__plan-status-badge--enrolled">
                        Enrolled
                      </span>
                    </div>
                    <div className="post-enrollment-dashboard__plan-balance">
                      <span className="post-enrollment-dashboard__plan-balance-label">Current Balance</span>
                      <span className="post-enrollment-dashboard__plan-balance-value">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(plan.balance)}
                      </span>
                    </div>
                    <div className="post-enrollment-dashboard__plan-action">
                      <Button
                        onClick={() => navigate(`/enrollment/manage/${plan.planId}`)}
                        className="post-enrollment-dashboard__cta"
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>

          {/* ZONE C — Growth & Progress */}
          <div className="post-enrollment-dashboard__zone-c">
            {/* Performance Snapshot */}
            <DashboardCard
              title="Performance Snapshot"
              action={
                <Button
                  onClick={() => navigate("/investments/performance")}
                  className="post-enrollment-dashboard__link-button"
                >
                  View details
                </Button>
              }
            >
              <div className="post-enrollment-dashboard__performance">
                <div className="post-enrollment-dashboard__performance-toggle">
                  <button
                    type="button"
                    className="post-enrollment-dashboard__performance-button post-enrollment-dashboard__performance-button--active"
                  >
                    YTD
                  </button>
                  <button type="button" className="post-enrollment-dashboard__performance-button">
                    1Y
                  </button>
                  <button type="button" className="post-enrollment-dashboard__performance-button">
                    All
                  </button>
                </div>
                <div className="post-enrollment-dashboard__performance-value">
                  <span className="post-enrollment-dashboard__performance-label">Year-to-Date Return</span>
                  <span className="post-enrollment-dashboard__performance-number">
                    {enrollment.performance.ytd > 0 ? "+" : ""}
                    {enrollment.performance.ytd.toFixed(2)}%
                  </span>
                </div>
                {/* Simple line chart placeholder */}
                <div className="post-enrollment-dashboard__performance-chart">
                  <div className="post-enrollment-dashboard__chart-placeholder">
                    <p>Performance chart visualization</p>
                  </div>
                </div>
              </div>
            </DashboardCard>

            {/* Retirement Goal Progress */}
            <DashboardCard
              title="Retirement Goal Progress"
              action={
                <Button
                  onClick={() => navigate("/investments/projections")}
                  className="post-enrollment-dashboard__link-button"
                >
                  View projections
                </Button>
              }
            >
              <div className="post-enrollment-dashboard__goal-progress">
                <div className="post-enrollment-dashboard__goal-header">
                  <span className="post-enrollment-dashboard__goal-label">Funded</span>
                  <span className="post-enrollment-dashboard__goal-percentage">
                    {enrollment.retirementGoal.currentProgress.toFixed(1)}%
                  </span>
                </div>
                <div className="post-enrollment-dashboard__goal-bar">
                  <div
                    className="post-enrollment-dashboard__goal-bar-fill"
                    style={{ width: `${Math.min(enrollment.retirementGoal.currentProgress, 100)}%` }}
                  />
                </div>
                <div className="post-enrollment-dashboard__goal-details">
                  <div className="post-enrollment-dashboard__goal-detail-item">
                    <span className="post-enrollment-dashboard__goal-detail-label">Projected Balance</span>
                    <span className="post-enrollment-dashboard__goal-detail-value">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(enrollment.retirementGoal.projectedBalance)}
                    </span>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* ZONE D — Health Checks */}
          <div className="post-enrollment-dashboard__zone-d">
            {/* Contribution Health */}
            <DashboardCard
              title="Contribution Health"
              action={
                <Button
                  onClick={() => navigate(`/enrollment/manage/${enrollment.enrolledPlans[0].planId}`)}
                  className="post-enrollment-dashboard__link-button"
                >
                  Change contribution
                </Button>
              }
            >
              <div className="post-enrollment-dashboard__contribution-health">
                <div className="post-enrollment-dashboard__health-item">
                  <span className="post-enrollment-dashboard__health-label">Contribution</span>
                  <span className="post-enrollment-dashboard__health-value">
                    {enrollment.enrolledPlans[0].contributionPercentage}%
                  </span>
                </div>
                <div className="post-enrollment-dashboard__health-item">
                  <span className="post-enrollment-dashboard__health-label">Employer Match Utilization</span>
                  <span className="post-enrollment-dashboard__health-value">
                    {enrollment.enrolledPlans[0].employerMatchUtilization}%
                  </span>
                </div>
                <div className="post-enrollment-dashboard__health-indicator">
                  <span
                    className={`post-enrollment-dashboard__health-badge post-enrollment-dashboard__health-badge--${
                      enrollment.enrolledPlans[0].employerMatchUtilization >= 100 ? "good" : "attention"
                    }`}
                  >
                    {enrollment.enrolledPlans[0].employerMatchUtilization >= 100 ? "Good" : "Needs attention"}
                  </span>
                </div>
              </div>
            </DashboardCard>

            {/* Investment Risk Level */}
            <DashboardCard
              title="Investment Risk Level"
              action={
                <Button
                  onClick={() => navigate("/enrollment/investments")}
                  className="post-enrollment-dashboard__link-button"
                >
                  View allocation
                </Button>
              }
            >
              <div className="post-enrollment-dashboard__risk-level">
                <div className="post-enrollment-dashboard__risk-header">
                  <span className="post-enrollment-dashboard__risk-label">
                    {enrollment.enrolledPlans[0].investmentRiskLabel}
                  </span>
                  <span className="post-enrollment-dashboard__risk-value">
                    {enrollment.enrolledPlans[0].investmentRiskLevel}/10
                  </span>
                </div>
                <p className="post-enrollment-dashboard__risk-explanation">
                  Your portfolio is balanced for moderate growth with controlled risk exposure.
                </p>
              </div>
            </DashboardCard>

            {/* Replacement Rate Progress */}
            <DashboardCard
              title="Replacement Rate Progress"
              action={
                <Button
                  onClick={() => navigate("/education/replacement-rate")}
                  className="post-enrollment-dashboard__link-button"
                >
                  Learn more
                </Button>
              }
            >
              <div className="post-enrollment-dashboard__replacement-rate">
                <div className="post-enrollment-dashboard__replacement-header">
                  <span className="post-enrollment-dashboard__replacement-label">Estimated Replacement Rate</span>
                  <span className="post-enrollment-dashboard__replacement-value">
                    {enrollment.retirementGoal.replacementRate}%
                  </span>
                </div>
                <div className="post-enrollment-dashboard__replacement-target">
                  <span className="post-enrollment-dashboard__replacement-target-label">Target: 70-80%</span>
                  <div className="post-enrollment-dashboard__replacement-indicator">
                    {enrollment.retirementGoal.replacementRate >= 70 && enrollment.retirementGoal.replacementRate <= 80 ? (
                      <span className="post-enrollment-dashboard__replacement-status post-enrollment-dashboard__replacement-status--on-track">
                        On track
                      </span>
                    ) : (
                      <span className="post-enrollment-dashboard__replacement-status post-enrollment-dashboard__replacement-status--review">
                        Review recommended
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* ZONE E — Activity & Alerts */}
          <div className="post-enrollment-dashboard__zone-e">
            {/* Alerts & To-Dos */}
            <DashboardCard title="Alerts & To-Dos">
              <div className="post-enrollment-dashboard__alerts">
                {enrollment.alerts.length > 0 ? (
                  <div className="post-enrollment-dashboard__alerts-list">
                    {enrollment.alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`post-enrollment-dashboard__alert post-enrollment-dashboard__alert--${alert.priority}`}
                      >
                        <div className="post-enrollment-dashboard__alert-content">
                          <h4 className="post-enrollment-dashboard__alert-title">{alert.title}</h4>
                          <p className="post-enrollment-dashboard__alert-message">{alert.message}</p>
                        </div>
                        <Button
                          onClick={() => navigate(alert.actionRoute)}
                          className="post-enrollment-dashboard__alert-action"
                        >
                          {alert.actionLabel}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="post-enrollment-dashboard__alerts-empty">
                    <p className="post-enrollment-dashboard__alerts-empty-text">You're all set</p>
                  </div>
                )}
              </div>
            </DashboardCard>

            {/* Recent Transactions */}
            <DashboardCard
              title="Recent Transactions"
              action={
                <Button
                  onClick={() => navigate("/transactions")}
                  className="post-enrollment-dashboard__link-button"
                >
                  View all transactions
                </Button>
              }
            >
              <div className="post-enrollment-dashboard__transactions">
                {enrollment.recentTransactions.slice(0, 7).map((transaction) => (
                  <div key={transaction.id} className="post-enrollment-dashboard__transaction">
                    <div className="post-enrollment-dashboard__transaction-info">
                      <span className="post-enrollment-dashboard__transaction-date">
                        {new Date(transaction.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="post-enrollment-dashboard__transaction-description">
                        {transaction.description}
                      </span>
                    </div>
                    <span
                      className={`post-enrollment-dashboard__transaction-amount ${
                        transaction.type === "fee"
                          ? "post-enrollment-dashboard__transaction-amount--negative"
                          : "post-enrollment-dashboard__transaction-amount--positive"
                      }`}
                    >
                      {transaction.type === "fee" ? "-" : "+"}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Math.abs(transaction.amount))}
                    </span>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>

          {/* ZONE F — Optional Learning */}
          <div className="post-enrollment-dashboard__zone-f">
            <DashboardCard
              title="Learning Resources"
              action={
                <Button
                  onClick={() => navigate("/education")}
                  className="post-enrollment-dashboard__link-button"
                >
                  Explore resources
                </Button>
              }
            >
              <div className="post-enrollment-dashboard__learning">
                <div className="post-enrollment-dashboard__learning-item">
                  <h4 className="post-enrollment-dashboard__learning-title">Understanding Your 401(k)</h4>
                  <p className="post-enrollment-dashboard__learning-description">
                    Learn how your retirement plan works and how to maximize your savings.
                  </p>
                </div>
                <div className="post-enrollment-dashboard__learning-item">
                  <h4 className="post-enrollment-dashboard__learning-title">Investment Basics</h4>
                  <p className="post-enrollment-dashboard__learning-description">
                    Get started with investing fundamentals and portfolio diversification.
                  </p>
                </div>
                <div className="post-enrollment-dashboard__learning-item">
                  <h4 className="post-enrollment-dashboard__learning-title">Retirement Planning</h4>
                  <p className="post-enrollment-dashboard__learning-description">
                    Plan for a secure retirement with our comprehensive guides.
                  </p>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
