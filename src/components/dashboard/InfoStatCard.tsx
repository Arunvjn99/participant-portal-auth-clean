import { DashboardCard } from "./DashboardCard";

interface InfoStatCardProps {
  label: string;
  value: string;
}

export const InfoStatCard = ({ label, value }: InfoStatCardProps) => {
  return (
    <DashboardCard>
      <div className="info-stat-card">
        <div className="info-stat-card__value">{value}</div>
        <div className="info-stat-card__label">{label}</div>
      </div>
    </DashboardCard>
  );
};
