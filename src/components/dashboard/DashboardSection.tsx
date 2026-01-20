import type { ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

const DashboardSection = ({ title, action, children }: DashboardSectionProps) => {
  return (
    <section className="dashboard-section">
      <header className="dashboard-section__header">
        <h2 className="dashboard-section__title">{title}</h2>
        {action && <div className="dashboard-section__action">{action}</div>}
      </header>
      <div className="dashboard-section__content">
        {children}
      </div>
    </section>
  );
};

export default DashboardSection;
