import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { AccountSnapshot } from "../../components/transactions/AccountSnapshot";
import { QuickActions } from "../../components/transactions/QuickActions";
import { TransactionHistoryTable } from "../../components/transactions/TransactionHistoryTable";
import { EmptyTransactionsState } from "../../components/transactions/EmptyTransactionsState";
import { transactionStore } from "../../data/transactionStore";
import type { Transaction, TransactionType } from "../../types/transactions";

export const TransactionsHub = () => {
  const navigate = useNavigate();
  const transactions = transactionStore.getAllTransactions();

  const handleViewDetails = (transactionId: string) => {
    navigate(`/transactions/${transactionId}`);
  };

  const handleResume = (transactionId: string, type: TransactionType) => {
    // Navigate to transaction application using the new route structure
    navigate(`/transactions/${type}/${transactionId}`);
  };

  const handleViewStatus = (transactionId: string, type: TransactionType) => {
    // Navigate to transaction application in read-only mode
    navigate(`/transactions/${type}/${transactionId}`);
  };

  const handleTransactionAction = (transaction: Transaction) => {
    switch (transaction.status) {
      case "draft":
        handleResume(transaction.id, transaction.type);
        break;
      case "active":
        handleViewStatus(transaction.id, transaction.type);
        break;
      case "completed":
        handleViewDetails(transaction.id);
        break;
      default:
        handleViewDetails(transaction.id);
    }
  };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="transactions-hub">
        <div className="transactions-hub__header">
          <h1 className="transactions-hub__title">Account Activity & Actions</h1>
          <p className="transactions-hub__description">
            View your account overview, start new transactions, and manage your activity.
          </p>
        </div>

        <div className="transactions-hub__content">
          {/* Account Snapshot - Always shown */}
          <AccountSnapshot />

          {/* Quick Actions - Always shown */}
          <QuickActions />

          {/* Transaction History or Empty State */}
          {transactions.length > 0 ? (
            <TransactionHistoryTable
              transactions={transactions}
              onTransactionAction={handleTransactionAction}
            />
          ) : (
            <EmptyTransactionsState />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
