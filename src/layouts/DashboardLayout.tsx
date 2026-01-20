import type { ReactNode } from "react";
import { AIFab } from "../components/ai/AIFab";

interface DashboardLayoutProps {
  header?: ReactNode;
  children: ReactNode;
}

export const DashboardLayout = ({ header, children }: DashboardLayoutProps) => {
  return (
    <div className="dashboard-layout">
      {header && <header className="dashboard-layout__header">{header}</header>}
      <main className="dashboard-layout__main">{children}</main>
      <AIFab />
    </div>
  );
};
