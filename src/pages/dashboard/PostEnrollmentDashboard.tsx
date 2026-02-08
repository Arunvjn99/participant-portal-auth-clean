import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { PostEnrollmentTopBanner } from "../../components/dashboard/PostEnrollmentTopBanner";
import { PlanOverviewCard } from "../../components/dashboard/PlanOverviewCard";
import { GoalSimulatorCard } from "../../components/dashboard/GoalSimulatorCard";
import { SmartNudgeCard } from "../../components/dashboard/SmartNudgeCard";
import { PortfolioTable } from "../../components/dashboard/PortfolioTable";
import { LearningHub } from "../../components/dashboard/LearningHub";
import { AllocationChart } from "../../components/investments/AllocationChart";
import { MOCK_POST_ENROLLMENT } from "../../data/postEnrollmentDashboard";

/**
 * Post-Enrollment Dashboard - Figma 519-4705
 * Read-only + action dashboard. NO stepper, NO floating cards, NO enrollment CTA logic.
 */
export const PostEnrollmentDashboard = () => {
  const navigate = useNavigate();
  const data = MOCK_POST_ENROLLMENT;

  // Convert portfolio to allocation format for chart
  const allocationForChart = data.portfolio.map((r) => ({
    fundId: r.fundId,
    percentage: r.allocationPct,
  }));

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="ped">
        {/* Top Banner - full width */}
        <PostEnrollmentTopBanner
          percentOnTrack={data.topBanner.percentOnTrack}
          subText={data.topBanner.subText}
          actionRoute={data.topBanner.actionRoute}
        />

        {/* 2-column grid: Left 70%, Right 30% */}
        <div className="ped__grid">
          <div className="ped__left">
            {/* Plan Overview */}
            <PlanOverviewCard
              plan={data.plan}
              balances={data.balances}
              isWithdrawalRestricted={data.isWithdrawalRestricted}
            />

            {/* Quick Actions */}
            <section className="ped__section">
              <h2 className="ped__section-title">Quick Actions</h2>
              <div className="ped__quick-actions">
                <button type="button" className="ped__qa-btn" onClick={() => navigate("/enrollment/contribution")}>
                  <span className="ped__qa-icon">¢</span>
                  <span>Change Contribution</span>
                </button>
                <button type="button" className="ped__qa-btn" onClick={() => navigate("/transactions/transfer/start")}>
                  <span className="ped__qa-icon">↔</span>
                  <span>Transfer Funds</span>
                </button>
                <button type="button" className="ped__qa-btn" onClick={() => navigate("/transactions/rebalance/start")}>
                  <span className="ped__qa-icon">⟳</span>
                  <span>Rebalance</span>
                </button>
                <button type="button" className="ped__qa-btn" onClick={() => navigate("/transactions/rollover/start")}>
                  <span className="ped__qa-icon">↪</span>
                  <span>Start Rollover</span>
                </button>
                <button type="button" className="ped__qa-btn" onClick={() => navigate("/profile")}>
                  <span className="ped__qa-icon">👤</span>
                  <span>Update Profile</span>
                </button>
              </div>
            </section>

            {/* Smart Nudges */}
            <section className="ped__section">
              <div className="ped__section-header">
                <h2 className="ped__section-title">Smart Nudges</h2>
                <span className="ped__badge">NEW INSIGHTS</span>
              </div>
              <div className="ped__nudges">
                {data.smartNudges.map((nudge) => (
                  <SmartNudgeCard key={nudge.id} nudge={nudge} />
                ))}
              </div>
            </section>

            {/* Portfolio Table */}
            <section className="ped__section">
              <PortfolioTable rows={data.portfolio} />
            </section>

            {/* Footer CTA */}
            <section className="ped__footer-cta">
              <div className="ped__footer-cta-content">
                <h3 className="ped__footer-cta-title">Need help deciding?</h3>
                <p className="ped__footer-cta-text">
                  Our advisors are available to discuss which plan is right for your financial goals.
                </p>
              </div>
              <button
                type="button"
                className="ped__footer-cta-btn"
                onClick={() => navigate("/investments")}
              >
                Schedule a consultation
              </button>
            </section>
          </div>

          <div className="ped__right">
            {/* Goal Simulator */}
            <GoalSimulatorCard data={data.goalSimulator} />

            {/* Current Allocation */}
            <article className="ped__allocation">
              <h2 className="ped__allocation-title">Current Allocation</h2>
              <p className="ped__allocation-desc">{data.allocationDescription}</p>
              <AllocationChart allocations={allocationForChart} centerLabel="Allocated" showValidBadge={false} />
              <a href="/investments" className="ped__allocation-link">Read full analysis →</a>
            </article>

            {/* Learning Hub - also in right column per Figma */}
            <LearningHub />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
