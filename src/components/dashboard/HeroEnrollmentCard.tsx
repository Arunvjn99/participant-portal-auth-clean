import { useState } from "react";
import { DashboardCard } from "./DashboardCard";
import Button from "../ui/Button";
import { EnrollmentWizard } from "../enrollment/EnrollmentWizard";

interface HeroEnrollmentCardProps {
  greeting?: string;
  headline?: string;
  description?: string;
  media?: React.ReactNode;
}

export const HeroEnrollmentCard = ({
  greeting = "Welcome back",
  headline = "Get started with your 401(k)",
  description = "Enroll in your retirement plan today and start building your financial future. The process is simple and takes just a few minutes.",
  media,
}: HeroEnrollmentCardProps) => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleEnrollClick = () => {
    setIsWizardOpen(true);
  };

  return (
    <>
      <DashboardCard>
        <div className="hero-enrollment-card">
          <div className="hero-enrollment-card__content">
            <p className="hero-enrollment-card__greeting">{greeting}</p>
            <h1 className="hero-enrollment-card__headline">{headline}</h1>
            <p className="hero-enrollment-card__description">{description}</p>
            <Button className="hero-enrollment-card__button" onClick={handleEnrollClick}>
              Enroll Now
            </Button>
          </div>
          <div className="hero-enrollment-card__media">{media}</div>
        </div>
      </DashboardCard>
      <EnrollmentWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </>
  );
};
