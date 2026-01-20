import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../dashboard/DashboardHeader";
import { TransactionFlowStepper } from "./TransactionFlowStepper";
import { transactionStore } from "../../data/transactionStore";
import type { TransactionType, Transaction } from "../../types/transactions";

/**
 * Step definition for transaction application flows
 */
export interface TransactionStepDefinition {
  stepId: string;
  label: string;
  component: React.ComponentType<TransactionStepProps>;
  validate?: (data: any) => boolean | Promise<boolean>;
}

/**
 * Props passed to each step component
 */
export interface TransactionStepProps {
  currentStep: number;
  totalSteps: number;
  transaction: Transaction;
  initialData?: any;
  onDataChange?: (data: any) => void;
  readOnly?: boolean;
}

/**
 * Props for TransactionApplication component
 */
export interface TransactionApplicationProps {
  transactionType: TransactionType;
  steps: TransactionStepDefinition[];
  initialData?: any;
  onSubmit?: (transaction: Transaction, data: any) => void | Promise<void>;
  readOnly?: boolean;
}

/**
 * Generic transaction application component that handles:
 * - Stepper rendering
 * - Current step index management
 * - Next / Back / Save & Exit behavior
 * - Final submit handling
 */
export const TransactionApplication = ({
  transactionType,
  steps,
  initialData,
  onSubmit,
  readOnly: propReadOnly,
}: TransactionApplicationProps) => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<any>(initialData || {});

  // If no transactionId, create a draft and redirect
  if (!transactionId) {
    const draft = transactionStore.createDraft(transactionType);
    navigate(`/transactions/${transactionType}/${draft.id}`, { replace: true });
    return null;
  }

  const transaction = transactionStore.getTransaction(transactionId);

  if (!transaction) {
    return (
      <DashboardLayout header={<DashboardHeader />}>
        <div className="transaction-application">
          <p>Transaction not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  // Determine read-only mode based on transaction status
  // Draft: editable (readOnly = false)
  // Active: read-only navigation only (readOnly = true)
  // Completed: fully read-only (readOnly = true)
  const readOnly = propReadOnly !== undefined 
    ? propReadOnly 
    : transaction.status !== "draft";

  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;
  const currentStepDefinition = steps[currentStep];
  const CurrentStepComponent = currentStepDefinition.component;

  const handleNext = async () => {
    if (readOnly) {
      // In read-only mode, just navigate forward through steps
      if (!isLastStep) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }

    if (isLastStep) {
      // Handle submission
      if (onSubmit) {
        await onSubmit(transaction, stepData);
      } else {
        // Default submit behavior
        console.log("Submit transaction", { transaction, stepData });
      }
      // Navigate to transactions hub after submission
      navigate("/transactions");
    } else {
      // Optional: Validate before proceeding
      if (currentStepDefinition.validate) {
        const isValid = await currentStepDefinition.validate(stepData);
        if (!isValid) {
          return; // Stay on current step if validation fails
        }
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndExit = () => {
    // Transaction is already saved as draft
    navigate("/transactions");
  };

  const handleDataChange = (data: any) => {
    if (readOnly) {
      // Prevent data changes in read-only mode
      return;
    }
    setStepData((prev: any) => ({ ...prev, ...data }));
  };

  // Build step labels for the stepper
  const stepLabels = steps.map((step) => step.label);

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="transaction-application">
        <div className="transaction-application__header">
          <button
            type="button"
            onClick={() => navigate("/transactions")}
            className="transaction-application__back-button"
            aria-label="Back to transactions"
          >
            ← Back to Transactions
          </button>
          <h1 className="transaction-application__title">
            {getTransactionTypeLabel(transactionType)} Application
          </h1>
        </div>

        <div className="transaction-application__stepper">
          <TransactionFlowStepper 
            transactionType={transactionType} 
            currentStep={currentStep}
            stepLabels={stepLabels}
          />
        </div>

        <div className="transaction-application__content">
          {readOnly && (
            <div className="transaction-application__read-only-banner">
              <span className="transaction-application__read-only-label">
                {transaction.status === "completed" ? "View Only" : "Read Only"}
              </span>
              {transaction.status === "active" && (
                <span className="transaction-application__read-only-note">
                  This transaction is being processed. You can view details but cannot make changes.
                </span>
              )}
              {transaction.status === "completed" && (
                <span className="transaction-application__read-only-note">
                  This transaction has been completed. You can view details and documents.
                </span>
              )}
            </div>
          )}
          <CurrentStepComponent
            currentStep={currentStep}
            totalSteps={totalSteps}
            transaction={transaction}
            initialData={stepData}
            onDataChange={handleDataChange}
            readOnly={readOnly}
          />
        </div>

        <div className="transaction-application__footer">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="transaction-application__button transaction-application__button--back"
          >
            Back
          </button>
          <div className="transaction-application__footer-actions">
            {!readOnly && (
              <button
                type="button"
                onClick={handleSaveAndExit}
                className="transaction-application__button transaction-application__button--save"
              >
                Save & Exit
              </button>
            )}
            {readOnly ? (
              <button
                type="button"
                onClick={() => navigate("/transactions")}
                className="transaction-application__button transaction-application__button--next"
              >
                Back to Transactions
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="transaction-application__button transaction-application__button--next"
              >
                {isLastStep ? "Submit" : "Next"}
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const getTransactionTypeLabel = (type: TransactionType): string => {
  switch (type) {
    case "loan":
      return "401(k) Loan";
    case "withdrawal":
      return "Hardship Withdrawal";
    case "distribution":
      return "Distribution";
    case "rollover":
      return "Rollover";
    case "transfer":
      return "Transfer Investments";
    case "rebalance":
      return "Rebalance Portfolio";
    default:
      return "Transaction";
  }
};
