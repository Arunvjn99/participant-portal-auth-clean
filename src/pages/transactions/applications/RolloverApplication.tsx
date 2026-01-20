import { BaseApplication } from "./BaseApplication";
import { DashboardCard } from "../../../components/dashboard/DashboardCard";
import { getStepLabels } from "../../../config/transactionSteps";

export const RolloverApplication = () => {
  const stepLabels = getStepLabels("rollover");

  const renderStepContent = (currentStep: number) => {
    switch (currentStep) {
      case 0: // Eligibility
        return (
          <DashboardCard title={stepLabels[0]}>
            <p>Rollover application eligibility check will be implemented here.</p>
          </DashboardCard>
        );
      case 1: // Rollover Amount
        return (
          <DashboardCard title={stepLabels[1]}>
            <p>Rollover amount selection will be implemented here.</p>
          </DashboardCard>
        );
      case 2: // Destination Account
        return (
          <DashboardCard title={stepLabels[2]}>
            <p>Destination account information will be implemented here.</p>
          </DashboardCard>
        );
      case 3: // Review & Submit
        return (
          <DashboardCard title={stepLabels[3]}>
            <p>Review your rollover details and submit your application.</p>
            <p>Summary and warnings will be displayed here.</p>
          </DashboardCard>
        );
      default:
        return null;
    }
  };

  return (
    <BaseApplication transactionType="rollover">
      {(currentStep) => renderStepContent(currentStep)}
    </BaseApplication>
  );
};
