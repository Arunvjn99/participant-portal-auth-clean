import { useState, useMemo } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { DashboardCard } from "../../components/dashboard/DashboardCard";
import { EnrollmentStepper } from "../../components/enrollment/EnrollmentStepper";
import { AllocationChart } from "../../components/investments/AllocationChart";
import { useEnrollment } from "../../enrollment/context/EnrollmentContext";
import { useInvestment } from "../../context/InvestmentContext";
import { getFundById } from "../../data/mockFunds";
import Button from "../../components/ui/Button";
import type { SelectedPlanId } from "../../enrollment/context/EnrollmentContext";
import type { ContributionSource } from "../../enrollment/logic/types";

// Plan name mapping
const PLAN_NAMES: Record<SelectedPlanId, string> = {
  traditional_401k: "Traditional 401(k)",
  roth_401k: "Roth 401(k)",
  roth_ira: "Roth IRA",
  null: "",
};

// Source name mapping
const SOURCE_NAMES: Record<ContributionSource, string> = {
  preTax: "Pre-tax",
  roth: "Roth",
  afterTax: "After-tax",
};

/**
 * Review - Final enrollment review page before commitment
 * Read-only summary with controlled edit redirects
 */
export const Review = () => {
  const navigate = useNavigate();
  const enrollment = useEnrollment();
  const investment = useInvestment();

  // Document acknowledgements
  const [acknowledgements, setAcknowledgements] = useState({
    spd: false,
    feeDisclosure: false,
    terms: false,
  });

  // Prerequisites validation
  const prerequisites = useMemo(() => {
    // Wait for enrollment context to be initialized
    if (!enrollment.state.isInitialized) {
      return {
        hasPlan: false,
        hasContribution: false,
        hasInvestment: false,
        allMet: false,
        loading: true,
      };
    }

    const hasPlan = enrollment.state.selectedPlan !== null;
    const hasContribution = enrollment.state.contributionAmount > 0;
    const hasInvestment = investment.draftAllocation.length > 0 && investment.allocationState.isValid;

    return {
      hasPlan,
      hasContribution,
      hasInvestment,
      allMet: hasPlan && hasContribution && hasInvestment,
      loading: false,
    };
  }, [
    enrollment.state.isInitialized,
    enrollment.state.selectedPlan,
    enrollment.state.contributionAmount,
    investment.draftAllocation,
    investment.allocationState.isValid,
  ]);

  // Guard: Wait for context to initialize, then check prerequisites
  // Only redirect if context is initialized AND prerequisites are missing
  if (prerequisites.loading) {
    // Context not ready yet, don't render or redirect
    return null;
  }

  // Context is initialized, now check prerequisites
  if (!prerequisites.hasPlan) {
    return <Navigate to="/enrollment/choose-plan" replace />;
  }
  if (!prerequisites.hasContribution) {
    return <Navigate to="/enrollment/contribution" replace />;
  }
  if (!prerequisites.hasInvestment) {
    return <Navigate to="/enrollment/investments" replace />;
  }

  const selectedPlanName = enrollment.state.selectedPlan ? PLAN_NAMES[enrollment.state.selectedPlan] : "";
  const selectedPlanId = enrollment.state.selectedPlan;

  // Calculate contribution breakdown by source
  const contributionBreakdown = useMemo(() => {
    const sources = enrollment.state.contributionSource;
    const totalPercentage = enrollment.state.contributionAmount;
    
    // For now, if multiple sources, assume equal split
    // In a real app, this would come from source allocations
    if (sources.length === 1) {
      const source = sources[0];
      return {
        [source]: totalPercentage,
      };
    } else if (sources.length > 1) {
      const perSource = totalPercentage / sources.length;
      const breakdown: Record<ContributionSource, number> = {
        preTax: 0,
        roth: 0,
        afterTax: 0,
      };
      sources.forEach((source) => {
        breakdown[source] = perSource;
      });
      return breakdown;
    }
    return { preTax: 0, roth: 0, afterTax: 0 };
  }, [enrollment.state.contributionSource, enrollment.state.contributionAmount]);

  // Group investment allocations by source (for now, all go to primary source)
  // In a real app, this would track source-specific allocations
  const investmentBySource = useMemo(() => {
    const primarySource = enrollment.state.contributionSource[0] || "preTax";
    return {
      [primarySource]: {
        totalPercentage: 100,
        funds: investment.draftAllocation.map((alloc) => ({
          fundName: getFundById(alloc.fundId)?.name || "Unknown Fund",
          percentage: alloc.percentage,
        })),
      },
    };
  }, [enrollment.state.contributionSource, investment.draftAllocation]);

  // Calculate projected value (simplified)
  const projectedValue = useMemo(() => {
    const yearsToRetirement = enrollment.state.retirementAge - enrollment.state.currentAge;
    const monthlyContribution = enrollment.monthlyContribution.employee;
    const annualContribution = monthlyContribution * 12;
    const expectedReturn = investment.allocationState.expectedReturn / 100;
    const currentBalance = enrollment.state.currentBalance;

    // Simplified projection: compound growth
    let projected = currentBalance;
    for (let i = 0; i < yearsToRetirement; i++) {
      projected = projected * (1 + expectedReturn) + annualContribution;
    }

    return projected;
  }, [
    enrollment.state.retirementAge,
    enrollment.state.currentAge,
    enrollment.monthlyContribution.employee,
    enrollment.state.currentBalance,
    investment.allocationState.expectedReturn,
  ]);

  // Calculate funded percentage (simplified)
  const fundedPercentage = useMemo(() => {
    // This would typically compare current savings to retirement goal
    // For now, use a simplified calculation
    const goal = projectedValue;
    const current = enrollment.state.currentBalance;
    return goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  }, [projectedValue, enrollment.state.currentBalance]);

  // Format risk level
  const formatRiskLevel = (risk: number) => {
    if (risk < 3) return "Conservative";
    if (risk < 5) return "Moderate";
    if (risk < 7) return "Moderate-Aggressive";
    return "Aggressive";
  };

  // All validations must pass
  const canEnroll = useMemo(() => {
    return (
      prerequisites.allMet &&
      investment.allocationState.isValid &&
      acknowledgements.spd &&
      acknowledgements.feeDisclosure &&
      acknowledgements.terms
    );
  }, [prerequisites.allMet, investment.allocationState.isValid, acknowledgements]);

  const handleEditContribution = () => {
    navigate("/enrollment/contribution");
  };

  const handleEditInvestments = () => {
    navigate("/enrollment/investments");
  };

  const handleEditBeneficiaries = () => {
    // TODO: Navigate to beneficiary management
    console.log("Navigate to beneficiary management");
  };

  const handleOptimize = () => {
    // TODO: Open optimization tool
    console.log("Open optimization tool");
  };

  const handleEnroll = () => {
    if (!canEnroll) return;

    // TODO: Commit enrollment to backend
    console.log("Committing enrollment:", {
      plan: enrollment.state.selectedPlan,
      contribution: enrollment.state.contributionAmount,
      investment: investment.draftAllocation,
    });

    // Navigate to post-enrollment dashboard
    navigate("/dashboard/post-enrollment");
  };

  const handleCancel = () => {
    navigate("/enrollment");
  };

  const handleBack = () => {
    navigate("/enrollment/investments");
  };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="review-page">
        {/* Enrollment Stepper */}
        <div className="review-page__stepper">
          <EnrollmentStepper currentStep={3} />
        </div>

        <div className="review-page__header">
          <button
            type="button"
            onClick={handleBack}
            className="review-page__back-button"
            aria-label="Back to investments"
          >
            <span className="review-page__back-icon" aria-hidden="true">←</span>
            <span className="review-page__back-text">Back</span>
          </button>
          <h1 className="review-page__title">Review Your Enrollment</h1>
          <p className="review-page__description">
            Please review all information before submitting your enrollment.
          </p>
        </div>

        <div className="review-page__content">
          <div className="review-page__left">
            {/* Plan Snapshot */}
            <DashboardCard title="Plan Snapshot">
              <div className="review-page__plan-snapshot">
                <div className="review-page__plan-info">
                  <div className="review-page__plan-item">
                    <span className="review-page__plan-label">Plan Name</span>
                    <span className="review-page__plan-value">{selectedPlanName}</span>
                  </div>
                  <div className="review-page__plan-item">
                    <span className="review-page__plan-label">Plan Type</span>
                    <span className="review-page__plan-value">{selectedPlanName}</span>
                  </div>
                  <div className="review-page__plan-item">
                    <span className="review-page__plan-label">Employer Match</span>
                    <span className="review-page__plan-value">
                      {enrollment.state.assumptions.employerMatchPercentage}% up to{" "}
                      {enrollment.state.assumptions.employerMatchCap}% of salary
                    </span>
                  </div>
                </div>
              </div>
            </DashboardCard>

            {/* Investment Goal Simulator */}
            <DashboardCard
              title="Investment Goal Simulator"
              action={
                <Button
                  onClick={handleOptimize}
                  className="review-page__optimize-button"
                  type="button"
                >
                  Optimize
                </Button>
              }
            >
              <div className="review-page__goal-simulator">
                <div className="review-page__goal-item">
                  <span className="review-page__goal-label">Funded %</span>
                  <span className="review-page__goal-value">{fundedPercentage.toFixed(1)}%</span>
                </div>
                <div className="review-page__goal-item">
                  <span className="review-page__goal-label">Projected Value at Retirement</span>
                  <span className="review-page__goal-value">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(projectedValue)}
                  </span>
                </div>
              </div>
            </DashboardCard>

            {/* Contributions Summary */}
            <DashboardCard
              title="Contributions Summary"
              action={
                <Button
                  onClick={handleEditContribution}
                  className="review-page__edit-button"
                  type="button"
                >
                  Edit
                </Button>
              }
            >
              <div className="review-page__contribution-summary">
                {contributionBreakdown.preTax > 0 && (
                  <div className="review-page__contribution-item">
                    <span className="review-page__contribution-label">Pre-tax</span>
                    <span className="review-page__contribution-value">
                      {contributionBreakdown.preTax.toFixed(1)}%
                    </span>
                  </div>
                )}
                {contributionBreakdown.roth > 0 && (
                  <div className="review-page__contribution-item">
                    <span className="review-page__contribution-label">Roth</span>
                    <span className="review-page__contribution-value">
                      {contributionBreakdown.roth.toFixed(1)}%
                    </span>
                  </div>
                )}
                {contributionBreakdown.afterTax > 0 && (
                  <div className="review-page__contribution-item">
                    <span className="review-page__contribution-label">After-tax</span>
                    <span className="review-page__contribution-value">
                      {contributionBreakdown.afterTax.toFixed(1)}%
                    </span>
                  </div>
                )}
                <div className="review-page__contribution-item review-page__contribution-item--total">
                  <span className="review-page__contribution-label">Total</span>
                  <span className="review-page__contribution-value">
                    {enrollment.state.contributionAmount.toFixed(1)}%
                  </span>
                </div>
              </div>
            </DashboardCard>

            {/* Investment Elections */}
            <DashboardCard
              title="Investment Elections"
              action={
                <Button
                  onClick={handleEditInvestments}
                  className="review-page__edit-button"
                  type="button"
                >
                  Edit
                </Button>
              }
            >
              <div className="review-page__investment-elections">
                {Object.entries(investmentBySource).map(([source, data]) => (
                  <div key={source} className="review-page__investment-source">
                    <h4 className="review-page__investment-source-title">
                      {SOURCE_NAMES[source as ContributionSource]}
                    </h4>
                    <div className="review-page__investment-funds">
                      {data.funds.map((fund, idx) => (
                        <div key={idx} className="review-page__investment-fund">
                          <span className="review-page__fund-name">{fund.fundName}</span>
                          <span className="review-page__fund-percentage">{fund.percentage.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="review-page__investment-total">
                      <span className="review-page__investment-total-label">Total</span>
                      <span className="review-page__investment-total-value">
                        {data.totalPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
                {!investment.allocationState.isValid && (
                  <p className="review-page__validation-error" role="alert">
                    Investment allocation must total exactly 100%
                  </p>
                )}
              </div>
            </DashboardCard>

            {/* Beneficiary Confirmation */}
            <DashboardCard
              title="Beneficiary Confirmation"
              action={
                <Button
                  onClick={handleEditBeneficiaries}
                  className="review-page__edit-button"
                  type="button"
                >
                  Edit
                </Button>
              }
            >
              <div className="review-page__beneficiaries">
                <p className="review-page__beneficiaries-note">
                  No beneficiaries on file. Please add beneficiaries before enrolling.
                </p>
              </div>
            </DashboardCard>

            {/* Documents & Disclosures */}
            <DashboardCard title="Documents & Disclosures">
              <div className="review-page__documents">
                <label className="review-page__document-checkbox">
                  <input
                    type="checkbox"
                    checked={acknowledgements.spd}
                    onChange={(e) =>
                      setAcknowledgements((prev) => ({ ...prev, spd: e.target.checked }))
                    }
                    className="review-page__checkbox"
                  />
                  <span>
                    I acknowledge that I have received and reviewed the{" "}
                    <button
                      type="button"
                      onClick={() => console.log("View SPD")}
                      className="review-page__document-link"
                    >
                      Summary Plan Description (SPD)
                    </button>
                  </span>
                </label>
                <label className="review-page__document-checkbox">
                  <input
                    type="checkbox"
                    checked={acknowledgements.feeDisclosure}
                    onChange={(e) =>
                      setAcknowledgements((prev) => ({ ...prev, feeDisclosure: e.target.checked }))
                    }
                    className="review-page__checkbox"
                  />
                  <span>
                    I acknowledge that I have received and reviewed the{" "}
                    <button
                      type="button"
                      onClick={() => console.log("View Fee Disclosure")}
                      className="review-page__document-link"
                    >
                      Fee Disclosure
                    </button>
                  </span>
                </label>
                <label className="review-page__document-checkbox">
                  <input
                    type="checkbox"
                    checked={acknowledgements.terms}
                    onChange={(e) =>
                      setAcknowledgements((prev) => ({ ...prev, terms: e.target.checked }))
                    }
                    className="review-page__checkbox"
                  />
                  <span>
                    I acknowledge that I have read and agree to the{" "}
                    <button
                      type="button"
                      onClick={() => console.log("View Terms")}
                      className="review-page__document-link"
                    >
                      Terms and Conditions
                    </button>
                  </span>
                </label>
              </div>
            </DashboardCard>

            {/* What Happens Next */}
            <DashboardCard title="What Happens Next">
              <div className="review-page__next-steps">
                <ol className="review-page__next-steps-list">
                  <li>Your enrollment will be processed within 1-2 business days</li>
                  <li>You will receive a confirmation email once processing is complete</li>
                  <li>Contributions will begin on your next pay period</li>
                  <li>You can view your account details in the Enrollment Management section</li>
                </ol>
              </div>
            </DashboardCard>
          </div>

          {/* Right Rail - Allocation Summary */}
          <div className="review-page__right">
            <DashboardCard className="review-page__allocation-summary">
              <div className="review-page__allocation-content">
                <h3 className="review-page__allocation-title">Allocation Summary</h3>

                <div className="review-page__allocation-chart">
                  <AllocationChart allocations={investment.draftAllocation} />
                </div>

                <div className="review-page__allocation-metrics">
                  <div className="review-page__allocation-metric">
                    <span className="review-page__allocation-metric-label">Expected Return</span>
                    <span className="review-page__allocation-metric-value">
                      {investment.allocationState.expectedReturn.toFixed(2)}%
                    </span>
                  </div>
                  <div className="review-page__allocation-metric">
                    <span className="review-page__allocation-metric-label">Total Fees</span>
                    <span className="review-page__allocation-metric-value">
                      {investment.allocationState.totalFees.toFixed(2)}%
                    </span>
                  </div>
                  <div className="review-page__allocation-metric">
                    <span className="review-page__allocation-metric-label">Risk Level</span>
                    <span className="review-page__allocation-metric-value">
                      {formatRiskLevel(investment.allocationState.riskLevel)} (
                      {investment.allocationState.riskLevel.toFixed(1)}/10)
                    </span>
                  </div>
                  <div className="review-page__allocation-metric">
                    <span className="review-page__allocation-metric-label">Auto-rebalance</span>
                    <span className="review-page__allocation-metric-value">Enabled</span>
                  </div>
                </div>

                <div className="review-page__allocation-validation">
                  <div className="review-page__allocation-total">
                    <span className="review-page__allocation-total-label">Total Allocation:</span>
                    <span
                      className={`review-page__allocation-total-value ${
                        investment.allocationState.isValid
                          ? "review-page__allocation-total-value--valid"
                          : "review-page__allocation-total-value--invalid"
                      }`}
                    >
                      {investment.allocationState.total.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* Ready to Enroll Section */}
        <div className="review-page__footer">
          <div className="review-page__footer-content">
            <div className="review-page__footer-actions">
              <Button
                onClick={handleCancel}
                className="review-page__cancel-button"
                type="button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEnroll}
                disabled={!canEnroll}
                className="review-page__enroll-button"
                type="button"
              >
                Enroll
              </Button>
            </div>
            {!canEnroll && (
              <p className="review-page__footer-note">
                Please complete all required sections and acknowledge all documents before enrolling.
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
