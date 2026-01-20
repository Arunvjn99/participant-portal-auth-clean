import type { ReactNode } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { AllocationSummary } from "../../components/investments/AllocationSummary";

interface InvestmentsLayoutProps {
  children: ReactNode;
}

/**
 * InvestmentsLayout - Two-column responsive layout
 * Left: strategy-specific content
 * Right: sticky AllocationSummary
 */
export default function InvestmentsLayout({ children }: InvestmentsLayoutProps) {
  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="investments-layout">
        <div className="investments-layout__left">
          {children}
        </div>
        <div className="investments-layout__right">
          <AllocationSummary />
        </div>
      </div>
    </DashboardLayout>
  );
}
