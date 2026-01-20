import { DashboardCard } from "./DashboardCard";
import Button from "../ui/Button";

export const ScoreUnlockCard = () => {
  return (
    <DashboardCard>
      <div className="score-unlock-card">
        <div className="score-unlock-card__icon" aria-hidden="true">
          📊
        </div>
        <h3 className="score-unlock-card__title">Unlock Your Personalized Score</h3>
        <p className="score-unlock-card__description">
          Get personalized insights into your retirement readiness and discover ways to improve your financial future.
        </p>
        <div className="score-unlock-card__actions">
          <Button>Enroll Now</Button>
          <a href="#" className="score-unlock-card__link">
            Learn more
          </a>
        </div>
      </div>
    </DashboardCard>
  );
};
