import { DashboardCard } from "../dashboard/DashboardCard";
import { transactionStore } from "../../data/transactionStore";
import type { Transaction } from "../../types/transactions";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * AccountSnapshot component displays high-level financial information
 * Values are derived from transactions and mock account data
 */
export const AccountSnapshot = () => {
  const transactions = transactionStore.getAllTransactions();

  // Calculate account metrics from transactions
  // In production, these would come from account API
  const totalAccountBalance = 250000; // Mock: base account balance
  const vestedBalance = 200000; // Mock: 80% vested
  const eligibleLoanAmount = Math.min(50000, totalAccountBalance * 0.5); // Max 50% or $50k

  // Calculate outstanding loan balance from active/completed loans
  const activeLoans = transactions.filter(
    (txn) => txn.type === "loan" && (txn.status === "active" || txn.status === "completed")
  );
  const outstandingLoanBalance = activeLoans.reduce((sum, loan) => {
    // Mock: assume 50% of loan amount is still outstanding for completed loans
    // In production, this would track actual repayment progress
    if (loan.status === "active") {
      return sum + (loan.amount || 0);
    }
    return sum + (loan.amount || 0) * 0.5;
  }, 0);

  // Get current monthly loan repayment from active loans
  const activeLoan = activeLoans.find((loan) => loan.status === "active");
  const currentMonthlyLoanRepayment = activeLoan?.repaymentInfo?.monthlyPayment || 0;

  return (
    <DashboardCard>
      <div className="account-snapshot">
        <h2 className="account-snapshot__title">Your Account Overview</h2>
        <div className="account-snapshot__grid">
          <div className="account-snapshot__item">
            <span className="account-snapshot__label">Total Balance</span>
            <span className="account-snapshot__value account-snapshot__value--primary">
              {formatCurrency(totalAccountBalance)}
            </span>
          </div>
          <div className="account-snapshot__item">
            <span className="account-snapshot__label">Vested Balance</span>
            <span className="account-snapshot__value">
              {formatCurrency(vestedBalance)}
            </span>
          </div>
          <div className="account-snapshot__item">
            <span className="account-snapshot__label">Eligible Loan Amount</span>
            <span className="account-snapshot__value">
              {formatCurrency(eligibleLoanAmount)}
            </span>
          </div>
          <div className="account-snapshot__item">
            <span className="account-snapshot__label">Outstanding Loan Balance</span>
            <span className="account-snapshot__value">
              {outstandingLoanBalance > 0 ? formatCurrency(outstandingLoanBalance) : "Not applicable"}
            </span>
          </div>
          <div className="account-snapshot__item">
            <span className="account-snapshot__label">Monthly Repayment</span>
            <span className="account-snapshot__value">
              {currentMonthlyLoanRepayment > 0 ? formatCurrency(currentMonthlyLoanRepayment) : "Not applicable"}
            </span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};
