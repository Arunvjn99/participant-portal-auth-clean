import { DashboardCard } from "./DashboardCard";
import Button from "../ui/Button";

interface AdvisorCardProps {
  name: string;
  role: string;
  description: string;
}

export const AdvisorCard = ({ name, role, description }: AdvisorCardProps) => {
  return (
    <DashboardCard>
      <div className="advisor-card">
        <div className="advisor-card__avatar" aria-hidden="true">
          👤
        </div>
        <h3 className="advisor-card__name">{name}</h3>
        <p className="advisor-card__role">{role}</p>
        <p className="advisor-card__description">{description}</p>
        <Button>Get Started</Button>
      </div>
    </DashboardCard>
  );
};
