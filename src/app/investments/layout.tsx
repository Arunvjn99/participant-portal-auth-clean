import type { ReactNode } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { EnrollmentStepper } from "../../components/enrollment/EnrollmentStepper";
import { AllocationSummary } from "../../components/investments/AllocationSummary";
import { InvestmentsFooter } from "../../components/investments/InvestmentsFooter";

interface InvestmentsLayoutProps {
  children: ReactNode;
}

/**
 * InvestmentsLayout - Per Figma (491-3389): Stepper full-width above grid; Plan Default Portfolio and Allocation Summary top-aligned.
 * Desktop: grid-cols-12, left col-span-8, right col-span-4
 */
export default function InvestmentsLayout({ children }: InvestmentsLayoutProps) {
  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="investments-layout">
        <div className="enrollment-stepper-section investments-layout__stepper">
          <EnrollmentStepper
            currentStep={2}
            title="Investment Elections"
            subtitle="Choose how your contributions are invested."
          />
        </div>
        <div className="investments-layout__content">
          <div className="investments-layout__left">
            {children}
          </div>
          <div className="investments-layout__right">
            <AllocationSummary variant="enrollment" />
          </div>
        </div>
        <InvestmentsFooter />
      </div>
    </DashboardLayout>
  );
}
