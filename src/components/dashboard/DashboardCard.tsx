import type { ReactNode } from "react";

interface DashboardCardProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
  isRecommended?: boolean;
}

export const DashboardCard = ({ children, title, action, isRecommended }: DashboardCardProps) => {
  return (
    <article className={`dashboard-card ${isRecommended ? "dashboard-card--recommended" : ""}`}>
      {(title || action) && (
        <header className="dashboard-card__header">
          {title && <h2 className="dashboard-card__title">{title}</h2>}
          {action && <div className="dashboard-card__action">{action}</div>}
        </header>
      )}
      <div className="dashboard-card__content">{children}</div>
    </article>
  );
};
