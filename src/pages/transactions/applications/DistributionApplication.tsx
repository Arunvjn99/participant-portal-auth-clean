import { BaseApplication } from "./BaseApplication";
import { DashboardCard } from "../../../components/dashboard/DashboardCard";
import { getStepLabels } from "../../../config/transactionSteps";

export const DistributionApplication = () => {
  const stepLabels = getStepLabels("distribution");

  const renderStepContent = (currentStep: number) => {
    switch (currentStep) {
      case 0: // Eligibility
        return (
          <DashboardCard title={stepLabels[0]}>
            <p>Distribution application eligibility check will be implemented here.</p>
          </DashboardCard>
        );
      case 1: // Distribution Amount
        return (
          <DashboardCard title={stepLabels[1]}>
            <p>Distribution amount selection will be implemented here.</p>
          </DashboardCard>
        );
      case 2: // Tax Withholding
        return (
          <DashboardCard title={stepLabels[2]}>
            <p>Tax withholding options will be implemented here.</p>
          </DashboardCard>
        );
      case 3: // Review & Submit
        return (
          <DashboardCard title={stepLabels[3]}>
            <p>Review your distribution details and submit your application.</p>
            <p>Summary and warnings will be displayed here.</p>
          </DashboardCard>
        );
      default:
        return null;
    }
  };

  return (
    <BaseApplication transactionType="distribution">
      {(currentStep) => renderStepContent(currentStep)}
    </BaseApplication>
  );
};
