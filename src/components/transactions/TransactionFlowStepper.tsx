import { getStepLabels } from "../../config/transactionSteps";
import type { TransactionType } from "../../types/transactions";

interface TransactionFlowStepperProps {
  transactionType: TransactionType;
  currentStep: number;
  stepLabels?: string[];
}

/**
 * Unified stepper component for all transaction flows
 * Displays step labels and progress consistently across all transaction types
 */
export const TransactionFlowStepper = ({
  transactionType,
  currentStep,
  stepLabels: providedStepLabels,
}: TransactionFlowStepperProps) => {
  const stepLabels = providedStepLabels || getStepLabels(transactionType);
  const totalSteps = stepLabels.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const getStepStatus = (stepIndex: number): "completed" | "active" | "upcoming" => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "active";
    return "upcoming";
  };

  return (
    <div className="transaction-flow-stepper" role="progressbar" aria-label="Transaction progress">
      <div className="transaction-flow-stepper__header">
        <span className="transaction-flow-stepper__indicator">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <div className="transaction-flow-stepper__progress-bar">
          <div
            className="transaction-flow-stepper__progress-fill"
            style={{ width: `${progress}%` }}
            aria-valuenow={currentStep + 1}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
          />
        </div>
      </div>
      <div className="transaction-flow-stepper__steps">
        {stepLabels.map((label, index) => {
          const status = getStepStatus(index);
          return (
            <div
              key={index}
              className={`transaction-flow-stepper__step transaction-flow-stepper__step--${status}`}
            >
              <div className="transaction-flow-stepper__step-indicator">
                {status === "completed" && <span aria-hidden="true">✓</span>}
                {status === "active" && <span className="transaction-flow-stepper__step-number">{index + 1}</span>}
                {status === "upcoming" && <span className="transaction-flow-stepper__step-number">{index + 1}</span>}
              </div>
              <span className="transaction-flow-stepper__step-label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
