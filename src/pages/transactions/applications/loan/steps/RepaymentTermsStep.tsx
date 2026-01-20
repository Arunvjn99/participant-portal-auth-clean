import { DashboardCard } from "../../../../../components/dashboard/DashboardCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

export const RepaymentTermsStep = ({ transaction, initialData, onDataChange }: TransactionStepProps) => {
  return (
    <DashboardCard title="Repayment Terms">
      <p>Repayment terms selection will be implemented here.</p>
    </DashboardCard>
  );
};
