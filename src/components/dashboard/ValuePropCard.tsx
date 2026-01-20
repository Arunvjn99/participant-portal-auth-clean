import { DashboardCard } from "./DashboardCard";

interface ValuePropCardProps {
  icon?: string;
  title: string;
  description: string;
}

export const ValuePropCard = ({ icon = "✨", title, description }: ValuePropCardProps) => {
  return (
    <DashboardCard>
      <div className="value-prop-card">
        <div className="value-prop-card__icon" aria-hidden="true">
          {icon}
        </div>
        <h3 className="value-prop-card__title">{title}</h3>
        <p className="value-prop-card__description">{description}</p>
      </div>
    </DashboardCard>
  );
};
