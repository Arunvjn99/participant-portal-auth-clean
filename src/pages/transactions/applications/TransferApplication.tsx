import { BaseApplication } from "./BaseApplication";
import { DashboardCard } from "../../../components/dashboard/DashboardCard";
import { getStepLabels } from "../../../config/transactionSteps";

export const TransferApplication = () => {
  const stepLabels = getStepLabels("transfer");

  const renderStepContent = (currentStep: number) => {
    switch (currentStep) {
      case 0: // Eligibility
        return (
          <DashboardCard title={stepLabels[0]}>
            <p>Transfer application eligibility check will be implemented here.</p>
          </DashboardCard>
        );
      case 1: // Transfer Details
        return (
          <DashboardCard title={stepLabels[1]}>
            <p>Transfer details will be implemented here.</p>
          </DashboardCard>
        );
      case 2: // Investment Selection
        return (
          <DashboardCard title={stepLabels[2]}>
            <p>Investment selection will be implemented here.</p>
          </DashboardCard>
        );
      case 3: // Review & Submit
        return (
          <DashboardCard title={stepLabels[3]}>
            <p>Review your transfer details and submit your application.</p>
            <p>Summary and warnings will be displayed here.</p>
          </DashboardCard>
        );
      default:
        return null;
    }
  };

  return (
    <BaseApplication transactionType="transfer">
      {(currentStep) => renderStepContent(currentStep)}
    </BaseApplication>
  );
};
