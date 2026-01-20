import { useNavigate } from "react-router-dom";
import { DashboardCard } from "../dashboard/DashboardCard";
import Button from "../ui/Button";
import { AllocationChart } from "./AllocationChart";
import { useInvestment } from "../../context/InvestmentContext";
import { useState } from "react";
import { ConfirmAllocationModal } from "./ConfirmAllocationModal";

/**
 * AllocationSummary - Sticky right-side panel with allocation summary and CTA
 */
export const AllocationSummary = () => {
  const navigate = useNavigate();
  const { allocationState, confirmAllocation } = useInvestment();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmAllocation = () => {
    confirmAllocation();
    setShowConfirmModal(false);
    // Navigate to review page after confirmation
    navigate("/enrollment/review");
  };

  const formatPercentage = (value: number) => {
    return value.toFixed(2);
  };

  const formatRiskLevel = (risk: number) => {
    if (risk < 3) return "Conservative";
    if (risk < 5) return "Moderate";
    if (risk < 7) return "Moderate-Aggressive";
    return "Aggressive";
  };

  return (
    <>
      <DashboardCard className="allocation-summary allocation-summary--sticky">
        <div className="allocation-summary__content">
          <h3 className="allocation-summary__title">Allocation Summary</h3>

          <div className="allocation-summary__chart">
            <AllocationChart allocations={allocationState.allocations} />
          </div>

          <div className="allocation-summary__metrics">
            <div className="allocation-summary__metric">
              <span className="allocation-summary__metric-label">Expected Return</span>
              <span className="allocation-summary__metric-value">
                {formatPercentage(allocationState.expectedReturn)}%
              </span>
            </div>
            <div className="allocation-summary__metric">
              <span className="allocation-summary__metric-label">Total Fees</span>
              <span className="allocation-summary__metric-value">
                {formatPercentage(allocationState.totalFees)}%
              </span>
            </div>
            <div className="allocation-summary__metric">
              <span className="allocation-summary__metric-label">Risk Level</span>
              <span className="allocation-summary__metric-value">
                {formatRiskLevel(allocationState.riskLevel)} ({allocationState.riskLevel.toFixed(1)}/10)
              </span>
            </div>
          </div>

          <div className="allocation-summary__validation">
            <div className="allocation-summary__total">
              <span className="allocation-summary__total-label">Total Allocation:</span>
              <span
                className={`allocation-summary__total-value ${
                  allocationState.isValid
                    ? "allocation-summary__total-value--valid"
                    : "allocation-summary__total-value--invalid"
                }`}
              >
                {formatPercentage(allocationState.total)}%
              </span>
            </div>
            {!allocationState.isValid && (
              <p className="allocation-summary__error" role="alert">
                Allocation must total exactly 100%
              </p>
            )}
          </div>

          <Button
            onClick={handleConfirmClick}
            disabled={!allocationState.isValid}
            className="allocation-summary__cta"
            type="button"
          >
            Confirm Allocation
          </Button>
        </div>
      </DashboardCard>

      {showConfirmModal && (
        <ConfirmAllocationModal
          onConfirm={handleConfirmAllocation}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
};
