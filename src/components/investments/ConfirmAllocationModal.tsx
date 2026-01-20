import { Modal } from "../ui/Modal";
import Button from "../ui/Button";
import { useInvestment } from "../../context/InvestmentContext";
import { getFundById } from "../../data/mockFunds";

interface ConfirmAllocationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * ConfirmAllocationModal - Review screen showing old vs new allocation
 */
export const ConfirmAllocationModal = ({ onConfirm, onCancel }: ConfirmAllocationModalProps) => {
  const { currentAllocation, draftAllocation, allocationState } = useInvestment();

  // Get all unique fund IDs from both allocations
  const allFundIds = new Set([
    ...currentAllocation.map((a) => a.fundId),
    ...draftAllocation.map((a) => a.fundId),
  ]);

  const formatPercentage = (value: number) => {
    return value.toFixed(1);
  };

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <div className="confirm-allocation-modal">
        <h2 className="confirm-allocation-modal__title">Confirm Allocation Changes</h2>
        <p className="confirm-allocation-modal__description">
          Review your allocation changes before confirming. This will update your investment portfolio.
        </p>

        <div className="confirm-allocation-modal__comparison">
          <div className="confirm-allocation-modal__column">
            <h3 className="confirm-allocation-modal__column-title">Current Allocation</h3>
            <div className="confirm-allocation-modal__funds">
              {Array.from(allFundIds).map((fundId) => {
                const fund = getFundById(fundId);
                const current = currentAllocation.find((a) => a.fundId === fundId);
                if (!fund) return null;
                
                return (
                  <div key={fundId} className="confirm-allocation-modal__fund-item">
                    <span className="confirm-allocation-modal__fund-name">{fund.name}</span>
                    <span className="confirm-allocation-modal__fund-value">
                      {current ? `${formatPercentage(current.percentage)}%` : "0%"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="confirm-allocation-modal__arrow">→</div>

          <div className="confirm-allocation-modal__column">
            <h3 className="confirm-allocation-modal__column-title">New Allocation</h3>
            <div className="confirm-allocation-modal__funds">
              {Array.from(allFundIds).map((fundId) => {
                const fund = getFundById(fundId);
                const draft = draftAllocation.find((a) => a.fundId === fundId);
                if (!fund) return null;
                
                const current = currentAllocation.find((a) => a.fundId === fundId);
                const hasChanged = (current?.percentage || 0) !== (draft?.percentage || 0);
                
                return (
                  <div
                    key={fundId}
                    className={`confirm-allocation-modal__fund-item ${
                      hasChanged ? "confirm-allocation-modal__fund-item--changed" : ""
                    }`}
                  >
                    <span className="confirm-allocation-modal__fund-name">{fund.name}</span>
                    <span className="confirm-allocation-modal__fund-value">
                      {draft ? `${formatPercentage(draft.percentage)}%` : "0%"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="confirm-allocation-modal__summary">
          <div className="confirm-allocation-modal__summary-item">
            <span className="confirm-allocation-modal__summary-label">Expected Return</span>
            <span className="confirm-allocation-modal__summary-value">
              {allocationState.expectedReturn.toFixed(2)}%
            </span>
          </div>
          <div className="confirm-allocation-modal__summary-item">
            <span className="confirm-allocation-modal__summary-label">Total Fees</span>
            <span className="confirm-allocation-modal__summary-value">
              {allocationState.totalFees.toFixed(2)}%
            </span>
          </div>
          <div className="confirm-allocation-modal__summary-item">
            <span className="confirm-allocation-modal__summary-label">Risk Level</span>
            <span className="confirm-allocation-modal__summary-value">
              {allocationState.riskLevel.toFixed(1)}/10
            </span>
          </div>
        </div>

        <div className="confirm-allocation-modal__actions">
          <Button
            onClick={onCancel}
            className="confirm-allocation-modal__button confirm-allocation-modal__button--secondary"
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="confirm-allocation-modal__button confirm-allocation-modal__button--primary"
            type="button"
          >
            Confirm Allocation
          </Button>
        </div>
      </div>
    </Modal>
  );
};
