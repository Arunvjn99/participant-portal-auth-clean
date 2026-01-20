import type { ReactNode } from "react";

interface DashboardContentGridProps {
  left: ReactNode;
  right: ReactNode;
}

export const DashboardContentGrid = ({ left, right }: DashboardContentGridProps) => {
  return (
    <div className="dashboard-content-grid">
      <div className="dashboard-content-grid__left">{left}</div>
      <div className="dashboard-content-grid__right">{right}</div>
    </div>
  );
};
