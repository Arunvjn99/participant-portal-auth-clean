import { useState, useMemo } from "react";
import { DashboardCard } from "../dashboard/DashboardCard";
import { TransactionRow } from "./TransactionRow";
import { Input } from "../ui/Input";
import type { Transaction, TransactionType, TransactionStatus } from "../../types/transactions";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface TransactionHistoryTableProps {
  transactions: Transaction[];
  onTransactionAction: (transaction: Transaction) => void;
}

/**
 * TransactionHistoryTable component - table with search and filters
 */
export const TransactionHistoryTable = ({
  transactions,
  onTransactionAction,
}: TransactionHistoryTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");

  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter((transaction) => {
      // Search filter (by amount or type)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const amountMatch = formatCurrency(transaction.amount).toLowerCase().includes(query);
        const typeMatch = transaction.type.toLowerCase().includes(query);
        if (!amountMatch && !typeMatch) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all" && transaction.status !== statusFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== "all" && transaction.type !== typeFilter) {
        return false;
      }

      return true;
    });

    // Sort by date (most recent first)
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.dateInitiated).getTime();
      const dateB = new Date(b.dateInitiated).getTime();
      return dateB - dateA; // Most recent first
    });
  }, [transactions, searchQuery, statusFilter, typeFilter]);

  return (
    <DashboardCard>
      <div className="transaction-history-table">
        <div className="transaction-history-table__header">
          <h2 className="transaction-history-table__title">Transaction History</h2>
        </div>

        <div className="transaction-history-table__filters">
          <div className="transaction-history-table__search">
            <Input
              label=""
              type="text"
              placeholder="Search by amount or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="transaction-history-table__search-input"
            />
          </div>

          <div className="transaction-history-table__filter-group">
            <label className="transaction-history-table__filter-label">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | "all")}
              className="transaction-history-table__filter-select"
            >
              <option value="all">All</option>
              <option value="draft">In progress</option>
              <option value="active">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="transaction-history-table__filter-group">
            <label className="transaction-history-table__filter-label">Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TransactionType | "all")}
              className="transaction-history-table__filter-select"
            >
              <option value="all">All</option>
              <option value="loan">Loan</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="distribution">Distribution</option>
              <option value="rollover">Rollover</option>
              <option value="transfer">Transfer</option>
              <option value="rebalance">Rebalance</option>
            </select>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="transaction-history-table__empty">
            <p>No transactions match your filters.</p>
          </div>
        ) : (
          <div className="transaction-history-table__table">
            <div className="transaction-history-table__table-header">
              <div className="transaction-history-table__header-cell transaction-history-table__header-cell--type">
                Type
              </div>
              <div className="transaction-history-table__header-cell transaction-history-table__header-cell--amount">
                Amount
              </div>
              <div className="transaction-history-table__header-cell transaction-history-table__header-cell--status">
                Status
              </div>
              <div className="transaction-history-table__header-cell transaction-history-table__header-cell--date">
                Date
              </div>
              <div className="transaction-history-table__header-cell transaction-history-table__header-cell--action">
                Action
              </div>
              <div className="transaction-history-table__header-cell transaction-history-table__header-cell--expand">
              </div>
            </div>
            <div className="transaction-history-table__table-body">
              {filteredTransactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  onAction={onTransactionAction}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};
