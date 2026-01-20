import type { ReactNode } from "react";

interface DashboardGridProps {
  left: ReactNode;
  right: ReactNode;
}

export const DashboardGrid = ({ left, right }: DashboardGridProps) => {
  return (
    <div className="dashboard-grid">
      <div className="dashboard-grid__left">{left}</div>
      <div className="dashboard-grid__right">{right}</div>
    </div>
  );
};
