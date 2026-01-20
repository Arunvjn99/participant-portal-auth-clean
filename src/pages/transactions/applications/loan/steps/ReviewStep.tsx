import { DashboardCard } from "../../../../../components/dashboard/DashboardCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

export const ReviewStep = ({ transaction, initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const isReadOnly = readOnly || transaction.status !== "draft";
  const isIrreversible = transaction.isIrreversible;

  return (
    <DashboardCard title={isReadOnly ? "Review & Confirm" : "Review & Submit"}>
      <div className="review-step">
        <p>Review your loan details{isReadOnly ? "" : " and submit your application"}.</p>
        
        {isIrreversible && !isReadOnly && (
          <div className="review-step__warning">
            <strong>⚠️ Irreversible Action</strong>
            <p>This transaction cannot be undone once submitted. Please review all details carefully.</p>
          </div>
        )}

        <div className="review-step__summary">
          <p>Summary and warnings will be displayed here.</p>
        </div>

        {!isReadOnly && (
          <div className="review-step__confirmation">
            <label className="review-step__checkbox-label">
              <input
                type="checkbox"
                required
                className="review-step__checkbox"
                onChange={(e) => {
                  if (onDataChange) {
                    onDataChange({ confirmationAccepted: e.target.checked });
                  }
                }}
              />
              <span>I confirm that I have reviewed all details and understand the terms of this transaction.</span>
            </label>
          </div>
        )}

        {isReadOnly && (
          <div className="review-step__read-only-note">
            <p>This transaction has been {transaction.status === "completed" ? "completed" : "submitted for processing"}.</p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};
