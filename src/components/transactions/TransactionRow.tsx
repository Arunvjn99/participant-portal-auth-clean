import { useState } from "react";
import Button from "../ui/Button";
import type { Transaction } from "../../types/transactions";
import { TransactionStepper } from "./TransactionStepper";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "draft":
      return "In progress";
    case "active":
      return "Processing";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

const getTransactionTypeLabel = (type: string): string => {
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
      return type;
  }
};

interface TransactionRowProps {
  transaction: Transaction;
  onAction: (transaction: Transaction) => void;
}

/**
 * TransactionRow component - accordion row for transaction history table
 */
export const TransactionRow = ({ transaction, onAction }: TransactionRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getActionLabel = (status: Transaction["status"]): string => {
    switch (status) {
      case "draft":
        return "Resume";
      case "active":
        return "View Status";
      case "completed":
        return "View Details";
      default:
        return "View";
    }
  };

  return (
    <div className="transaction-row">
      <div
        className="transaction-row__header"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        aria-expanded={isExpanded}
      >
        <div className="transaction-row__cell transaction-row__cell--type">
          {getTransactionTypeLabel(transaction.type)}
        </div>
        <div className="transaction-row__cell transaction-row__cell--amount">
          {transaction.amount > 0 ? formatCurrency(transaction.amount) : "—"}
        </div>
        <div className="transaction-row__cell transaction-row__cell--status">
          <span className={`transaction-row__status transaction-row__status--${transaction.status}`}>
            {getStatusLabel(transaction.status)}
          </span>
        </div>
        <div className="transaction-row__cell transaction-row__cell--date">
          {new Date(transaction.dateInitiated).toLocaleDateString()}
        </div>
        <div className="transaction-row__cell transaction-row__cell--action">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAction(transaction);
            }}
            className="transaction-row__action-button"
          >
            {getActionLabel(transaction.status)}
          </Button>
        </div>
        <div className="transaction-row__cell transaction-row__cell--expand">
          <span className="transaction-row__expand-icon" aria-hidden="true">
            {isExpanded ? "▼" : "▶"}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="transaction-row__details">
          <div className="transaction-row__details-grid">
            <div className="transaction-row__detail-item">
              <span className="transaction-row__detail-label">Transaction ID:</span>
              <span className="transaction-row__detail-value">{transaction.id}</span>
            </div>
            {transaction.grossAmount && (
              <div className="transaction-row__detail-item">
                <span className="transaction-row__detail-label">Gross Amount:</span>
                <span className="transaction-row__detail-value">{formatCurrency(transaction.grossAmount)}</span>
              </div>
            )}
            {transaction.netAmount && (
              <div className="transaction-row__detail-item">
                <span className="transaction-row__detail-label">Net Amount:</span>
                <span className="transaction-row__detail-value">{formatCurrency(transaction.netAmount)}</span>
              </div>
            )}
            {transaction.fees !== undefined && transaction.fees > 0 && (
              <div className="transaction-row__detail-item">
                <span className="transaction-row__detail-label">Fees:</span>
                <span className="transaction-row__detail-value">{formatCurrency(transaction.fees)}</span>
              </div>
            )}
            {transaction.taxWithholding !== undefined && transaction.taxWithholding > 0 && (
              <div className="transaction-row__detail-item">
                <span className="transaction-row__detail-label">Tax Withholding:</span>
                <span className="transaction-row__detail-value">{formatCurrency(transaction.taxWithholding)}</span>
              </div>
            )}
            {transaction.dateCompleted && (
              <div className="transaction-row__detail-item">
                <span className="transaction-row__detail-label">Date Completed:</span>
                <span className="transaction-row__detail-value">
                  {new Date(transaction.dateCompleted).toLocaleDateString()}
                </span>
              </div>
            )}
            {transaction.processingTime && (
              <div className="transaction-row__detail-item">
                <span className="transaction-row__detail-label">Processing Time:</span>
                <span className="transaction-row__detail-value">{transaction.processingTime}</span>
              </div>
            )}
            {transaction.repaymentInfo && (
              <div className="transaction-row__detail-item">
                <span className="transaction-row__detail-label">Monthly Payment:</span>
                <span className="transaction-row__detail-value">
                  {formatCurrency(transaction.repaymentInfo.monthlyPayment)}
                </span>
              </div>
            )}
          </div>

          {transaction.status === "active" && transaction.milestones && (
            <div className="transaction-row__timeline">
              <h4 className="transaction-row__timeline-title">Status Timeline</h4>
              <TransactionStepper
                milestones={transaction.milestones}
                status={transaction.status}
              />
            </div>
          )}

          {transaction.status === "completed" && (
            <div className="transaction-row__documents">
              <h4 className="transaction-row__documents-title">Documents</h4>
              <div className="transaction-row__documents-list">
                <button
                  type="button"
                  className="transaction-row__document-link"
                  onClick={() => {
                    // TODO: Implement document download
                    console.log("Download document for", transaction.id);
                  }}
                >
                  View Confirmation
                </button>
                {transaction.type === "loan" && (
                  <button
                    type="button"
                    className="transaction-row__document-link"
                    onClick={() => {
                      // TODO: Implement document download
                      console.log("Download loan agreement for", transaction.id);
                    }}
                  >
                    Download Loan Agreement
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
