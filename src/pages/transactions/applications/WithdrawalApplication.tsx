import { BaseApplication } from "./BaseApplication";
import { DashboardCard } from "../../../components/dashboard/DashboardCard";
import { getStepLabels } from "../../../config/transactionSteps";

export const WithdrawalApplication = () => {
  const stepLabels = getStepLabels("withdrawal");

  const renderStepContent = (currentStep: number) => {
    switch (currentStep) {
      case 0: // Eligibility
        return (
          <DashboardCard title={stepLabels[0]}>
            <p>Withdrawal application eligibility check will be implemented here.</p>
          </DashboardCard>
        );
      case 1: // Withdrawal Amount
        return (
          <DashboardCard title={stepLabels[1]}>
            <p>Withdrawal amount selection will be implemented here.</p>
          </DashboardCard>
        );
      case 2: // Tax Information
        return (
          <DashboardCard title={stepLabels[2]}>
            <p>Tax information and withholding options will be implemented here.</p>
          </DashboardCard>
        );
      case 3: // Review & Submit
        return (
          <DashboardCard title={stepLabels[3]}>
            <p>Review your withdrawal details and submit your application.</p>
            <p>Summary and warnings will be displayed here.</p>
          </DashboardCard>
        );
      default:
        return null;
    }
  };

  return (
    <BaseApplication transactionType="withdrawal">
      {(currentStep) => renderStepContent(currentStep)}
    </BaseApplication>
  );
};
