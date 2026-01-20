import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { DashboardCard } from "../../components/dashboard/DashboardCard";
import Button from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { MOCK_ENROLLED_PLANS, type EnrolledPlan } from "../../data/mockEnrolledPlans";
import { OptOutModal } from "../../components/enrollment/OptOutModal";

/**
 * PlanDetailManagement - Detailed management view for a single enrolled plan
 * Read-only summary with controlled-edit CTAs
 */
export const PlanDetailManagement = () => {
  const navigate = useNavigate();
  const { planId } = useParams<{ planId: string }>();
  const [showOptOutModal, setShowOptOutModal] = useState(false);

  const plan = MOCK_ENROLLED_PLANS.find((p) => p.id === planId);

  if (!plan || plan.status !== "enrolled") {
    return (
      <DashboardLayout header={<DashboardHeader />}>
        <div className="plan-detail-management">
          <div className="plan-detail-management__error">
            <h1>Plan Not Found</h1>
            <p>The requested plan could not be found or is not enrolled.</p>
            <Button onClick={() => navigate("/enrollment")}>Back to Enrollment</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleEditContribution = () => {
    navigate("/enrollment/contribution");
  };

  const handleChangeInvestments = () => {
    navigate("/enrollment/investments");
  };

  const handleEditAutoFeatures = () => {
    // Navigate to auto-features edit page (could be a modal or separate page)
    console.log("Edit auto-features for plan:", plan.id);
  };

  const handleManageBeneficiaries = () => {
    // Navigate to beneficiaries management page
    console.log("Manage beneficiaries for plan:", plan.id);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOptOut = () => {
    setShowOptOutModal(true);
  };

  const handleOptOutConfirm = () => {
    // TODO: Implement opt-out logic
    console.log("Opting out of plan:", plan.id);
    setShowOptOutModal(false);
    navigate("/enrollment");
  };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="plan-detail-management">
        {/* Header */}
        <div className="plan-detail-management__header">
          <button
            type="button"
            onClick={() => navigate("/enrollment")}
            className="plan-detail-management__back-button"
            aria-label="Back to enrollment"
          >
            <span className="plan-detail-management__back-icon" aria-hidden="true">←</span>
            <span className="plan-detail-management__back-text">Back to Enrollment</span>
          </button>

          <div className="plan-detail-management__header-content">
            <div className="plan-detail-management__header-info">
              <h1 className="plan-detail-management__title">{plan.planName}</h1>
              <div className="plan-detail-management__header-meta">
                <span className="plan-detail-management__plan-id">Plan ID: {plan.planId}</span>
                <span className="plan-detail-management__plan-type">{plan.planType}</span>
              </div>
            </div>
            <div className="plan-detail-management__header-actions">
              <Button
                onClick={handlePrint}
                className="plan-detail-management__action-button plan-detail-management__action-button--secondary"
              >
                Print
              </Button>
              <Button
                onClick={handleOptOut}
                className="plan-detail-management__action-button plan-detail-management__action-button--danger"
              >
                Opt-out Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Balance Snapshot */}
        <DashboardCard title="Balance Snapshot">
          <div className="plan-detail-management__balance-grid">
            <div className="plan-detail-management__balance-item">
              <span className="plan-detail-management__balance-label">Plan Balance</span>
              <span className="plan-detail-management__balance-value">
                {plan.balance !== undefined
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(plan.balance)
                  : "Not available"}
              </span>
            </div>
            <div className="plan-detail-management__balance-item">
              <span className="plan-detail-management__balance-label">Vested Balance</span>
              <span className="plan-detail-management__balance-value">
                {plan.vestedBalance !== undefined
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(plan.vestedBalance)
                  : "Not available"}
              </span>
            </div>
            <div className="plan-detail-management__balance-item">
              <span className="plan-detail-management__balance-label">Last Contribution Date</span>
              <span className="plan-detail-management__balance-value">
                {plan.lastContributionDate
                  ? new Date(plan.lastContributionDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not available"}
              </span>
            </div>
          </div>
        </DashboardCard>

        {/* Contribution Election */}
        <DashboardCard
          title="Contribution Election"
          action={
            <Button
              onClick={handleEditContribution}
              className="plan-detail-management__edit-button"
            >
              Edit Contribution
            </Button>
          }
        >
          <div className="plan-detail-management__contribution-summary">
            {plan.contributionElection ? (
              <div className="plan-detail-management__contribution-breakdown">
                {plan.contributionElection.pretaxPercentage !== undefined &&
                  plan.contributionElection.pretaxPercentage > 0 && (
                    <div className="plan-detail-management__contribution-item">
                      <span className="plan-detail-management__contribution-label">Pre-tax</span>
                      <span className="plan-detail-management__contribution-value">
                        {plan.contributionElection.pretaxPercentage}%
                      </span>
                    </div>
                  )}
                {plan.contributionElection.rothPercentage !== undefined &&
                  plan.contributionElection.rothPercentage > 0 && (
                    <div className="plan-detail-management__contribution-item">
                      <span className="plan-detail-management__contribution-label">Roth</span>
                      <span className="plan-detail-management__contribution-value">
                        {plan.contributionElection.rothPercentage}%
                      </span>
                    </div>
                  )}
                {plan.contributionElection.afterTaxPercentage !== undefined &&
                  plan.contributionElection.afterTaxPercentage > 0 && (
                    <div className="plan-detail-management__contribution-item">
                      <span className="plan-detail-management__contribution-label">After-tax</span>
                      <span className="plan-detail-management__contribution-value">
                        {plan.contributionElection.afterTaxPercentage}%
                      </span>
                    </div>
                  )}
                {plan.contributionElection.catchUpPercentage !== undefined &&
                  plan.contributionElection.catchUpPercentage > 0 && (
                    <div className="plan-detail-management__contribution-item">
                      <span className="plan-detail-management__contribution-label">Catch-up</span>
                      <span className="plan-detail-management__contribution-value">
                        {plan.contributionElection.catchUpPercentage}%
                      </span>
                    </div>
                  )}
                <div className="plan-detail-management__contribution-item plan-detail-management__contribution-item--total">
                  <span className="plan-detail-management__contribution-label">Total</span>
                  <span className="plan-detail-management__contribution-value">
                    {plan.contributionElection.totalPercentage}%
                  </span>
                </div>
              </div>
            ) : (
              <p className="plan-detail-management__no-data">No contribution election on file.</p>
            )}
          </div>
        </DashboardCard>

        {/* Investment Election */}
        <DashboardCard
          title="Investment Election"
          action={
            <Button
              onClick={handleChangeInvestments}
              className="plan-detail-management__edit-button"
            >
              Change Investments
            </Button>
          }
        >
          <div className="plan-detail-management__investment-summary">
            {plan.investmentElection ? (
              <div className="plan-detail-management__investment-breakdown">
                {plan.investmentElection.pretax.totalPercentage > 0 && (
                  <div className="plan-detail-management__investment-source">
                    <h4 className="plan-detail-management__investment-source-title">Pre-tax</h4>
                    <div className="plan-detail-management__investment-funds">
                      {plan.investmentElection.pretax.funds.map((fund, idx) => (
                        <div key={idx} className="plan-detail-management__investment-fund">
                          <span className="plan-detail-management__fund-name">{fund.fundName}</span>
                          <span className="plan-detail-management__fund-percentage">{fund.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {plan.investmentElection.roth.totalPercentage > 0 && (
                  <div className="plan-detail-management__investment-source">
                    <h4 className="plan-detail-management__investment-source-title">Roth</h4>
                    <div className="plan-detail-management__investment-funds">
                      {plan.investmentElection.roth.funds.map((fund, idx) => (
                        <div key={idx} className="plan-detail-management__investment-fund">
                          <span className="plan-detail-management__fund-name">{fund.fundName}</span>
                          <span className="plan-detail-management__fund-percentage">{fund.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {plan.investmentElection.afterTax.totalPercentage > 0 && (
                  <div className="plan-detail-management__investment-source">
                    <h4 className="plan-detail-management__investment-source-title">After-tax</h4>
                    <div className="plan-detail-management__investment-funds">
                      {plan.investmentElection.afterTax.funds.map((fund, idx) => (
                        <div key={idx} className="plan-detail-management__investment-fund">
                          <span className="plan-detail-management__fund-name">{fund.fundName}</span>
                          <span className="plan-detail-management__fund-percentage">{fund.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {plan.investmentElection.catchUp.totalPercentage > 0 && (
                  <div className="plan-detail-management__investment-source">
                    <h4 className="plan-detail-management__investment-source-title">Catch-up</h4>
                    <div className="plan-detail-management__investment-funds">
                      {plan.investmentElection.catchUp.funds.map((fund, idx) => (
                        <div key={idx} className="plan-detail-management__investment-fund">
                          <span className="plan-detail-management__fund-name">{fund.fundName}</span>
                          <span className="plan-detail-management__fund-percentage">{fund.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="plan-detail-management__no-data">No investment election on file.</p>
            )}
          </div>
        </DashboardCard>

        {/* Auto-Features */}
        <DashboardCard
          title="Auto-Features"
          action={
            <Button
              onClick={handleEditAutoFeatures}
              className="plan-detail-management__edit-button"
            >
              Edit Auto-Features
            </Button>
          }
        >
          <div className="plan-detail-management__auto-features">
            {plan.autoFeatures ? (
              <div className="plan-detail-management__auto-features-content">
                <div className="plan-detail-management__auto-feature-item">
                  <span className="plan-detail-management__auto-feature-label">Auto Increase</span>
                  <span className="plan-detail-management__auto-feature-value">
                    {plan.autoFeatures.autoIncrease.enabled
                      ? `Enabled (${plan.autoFeatures.autoIncrease.increasePercentage}% ${plan.autoFeatures.autoIncrease.frequency}, max ${plan.autoFeatures.autoIncrease.maxPercentage}%)`
                      : "Disabled"}
                  </span>
                </div>
                <div className="plan-detail-management__auto-feature-item">
                  <span className="plan-detail-management__auto-feature-label">Annual Limit</span>
                  <span className="plan-detail-management__auto-feature-value">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(plan.autoFeatures.limits.annualLimit)}
                  </span>
                </div>
                <div className="plan-detail-management__auto-feature-item">
                  <span className="plan-detail-management__auto-feature-label">Catch-up Limit</span>
                  <span className="plan-detail-management__auto-feature-value">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(plan.autoFeatures.limits.catchUpLimit)}
                  </span>
                </div>
                <div className="plan-detail-management__auto-feature-item">
                  <span className="plan-detail-management__auto-feature-label">Employer Match Cap</span>
                  <span className="plan-detail-management__auto-feature-value">
                    {plan.autoFeatures.limits.employerMatchCap}%
                  </span>
                </div>
                {plan.autoFeatures.lastModified && (
                  <div className="plan-detail-management__auto-feature-item">
                    <span className="plan-detail-management__auto-feature-label">Last Modified</span>
                    <span className="plan-detail-management__auto-feature-value">
                      {new Date(plan.autoFeatures.lastModified).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="plan-detail-management__no-data">No auto-features configured.</p>
            )}
          </div>
        </DashboardCard>

        {/* Beneficiaries */}
        <DashboardCard
          title="Beneficiaries"
          action={
            <Button
              onClick={handleManageBeneficiaries}
              className="plan-detail-management__edit-button"
            >
              Manage Beneficiaries
            </Button>
          }
        >
          <div className="plan-detail-management__beneficiaries">
            {plan.beneficiaries ? (
              <div className="plan-detail-management__beneficiaries-content">
                {plan.beneficiaries.primary.length > 0 && (
                  <div className="plan-detail-management__beneficiary-group">
                    <h4 className="plan-detail-management__beneficiary-group-title">Primary</h4>
                    {plan.beneficiaries.primary.map((beneficiary, idx) => (
                      <div key={idx} className="plan-detail-management__beneficiary-item">
                        <span className="plan-detail-management__beneficiary-name">
                          {beneficiary.name}
                        </span>
                        <span className="plan-detail-management__beneficiary-relationship">
                          {beneficiary.relationship}
                        </span>
                        <span className="plan-detail-management__beneficiary-percentage">
                          {beneficiary.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {plan.beneficiaries.contingent.length > 0 && (
                  <div className="plan-detail-management__beneficiary-group">
                    <h4 className="plan-detail-management__beneficiary-group-title">Contingent</h4>
                    {plan.beneficiaries.contingent.map((beneficiary, idx) => (
                      <div key={idx} className="plan-detail-management__beneficiary-item">
                        <span className="plan-detail-management__beneficiary-name">
                          {beneficiary.name}
                        </span>
                        <span className="plan-detail-management__beneficiary-relationship">
                          {beneficiary.relationship}
                        </span>
                        <span className="plan-detail-management__beneficiary-percentage">
                          {beneficiary.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="plan-detail-management__no-data">No beneficiaries on file.</p>
            )}
          </div>
        </DashboardCard>

        {/* Documents */}
        <DashboardCard title="Documents">
          <div className="plan-detail-management__documents">
            <div className="plan-detail-management__document-item">
              <span className="plan-detail-management__document-name">Plan Documents</span>
              <Button
                onClick={() => console.log("View plan documents")}
                className="plan-detail-management__document-button"
              >
                View
              </Button>
            </div>
            <div className="plan-detail-management__document-item">
              <span className="plan-detail-management__document-name">Account Statements</span>
              <Button
                onClick={() => console.log("View statements")}
                className="plan-detail-management__document-button"
              >
                View
              </Button>
            </div>
          </div>
        </DashboardCard>

        {/* Activity Log */}
        <DashboardCard title="Activity Log">
          <div className="plan-detail-management__activity-log">
            {plan.activityLog && plan.activityLog.length > 0 ? (
              <div className="plan-detail-management__activity-items">
                {plan.activityLog.map((activity, idx) => (
                  <div key={idx} className="plan-detail-management__activity-item">
                    <div className="plan-detail-management__activity-date">
                      {new Date(activity.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="plan-detail-management__activity-content">
                      <span className="plan-detail-management__activity-action">{activity.action}</span>
                      <span className="plan-detail-management__activity-description">
                        {activity.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="plan-detail-management__no-data">No activity recorded.</p>
            )}
          </div>
        </DashboardCard>
      </div>

      {/* Opt-out Modal */}
      <OptOutModal
        isOpen={showOptOutModal}
        onClose={() => setShowOptOutModal(false)}
        onConfirm={handleOptOutConfirm}
        planName={plan.planName}
      />
    </DashboardLayout>
  );
};
