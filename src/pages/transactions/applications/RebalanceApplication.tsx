import { BaseApplication } from "./BaseApplication";
import { DashboardCard } from "../../../components/dashboard/DashboardCard";
import { getStepLabels } from "../../../config/transactionSteps";

export const RebalanceApplication = () => {
  const stepLabels = getStepLabels("rebalance");

  const renderStepContent = (currentStep: number) => {
    switch (currentStep) {
      case 0: // Eligibility
        return (
          <DashboardCard title={stepLabels[0]}>
            <p>Rebalance application eligibility check will be implemented here.</p>
          </DashboardCard>
        );
      case 1: // Current Allocation
        return (
          <DashboardCard title={stepLabels[1]}>
            <p>Current allocation display will be implemented here.</p>
          </DashboardCard>
        );
      case 2: // Target Allocation
        return (
          <DashboardCard title={stepLabels[2]}>
            <p>Target allocation selection will be implemented here.</p>
          </DashboardCard>
        );
      case 3: // Review & Submit
        return (
          <DashboardCard title={stepLabels[3]}>
            <p>Review your rebalance details and submit your application.</p>
            <p>Summary and warnings will be displayed here.</p>
          </DashboardCard>
        );
      default:
        return null;
    }
  };

  return (
    <BaseApplication transactionType="rebalance">
      {(currentStep) => renderStepContent(currentStep)}
    </BaseApplication>
  );
};
