import { DashboardCard } from "../../../../../components/dashboard/DashboardCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

export const EligibilityStep = ({ transaction, initialData, onDataChange }: TransactionStepProps) => {
  return (
    <DashboardCard title="Eligibility">
      <p>Loan application eligibility check will be implemented here.</p>
    </DashboardCard>
  );
};
