import { DashboardCard } from "../../../../../components/dashboard/DashboardCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

export const LoanAmountStep = ({ transaction, initialData, onDataChange }: TransactionStepProps) => {
  return (
    <DashboardCard title="Loan Amount">
      <p>Loan amount selection will be implemented here.</p>
    </DashboardCard>
  );
};
