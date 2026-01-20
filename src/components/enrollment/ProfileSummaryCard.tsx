import { DashboardCard } from "../dashboard/DashboardCard";

interface ProfileSummaryCardProps {
  age: number;
  retirementAge: number;
  salary: number;
  riskLevel: string;
}

export const ProfileSummaryCard = ({
  age,
  retirementAge,
  salary,
  riskLevel,
}: ProfileSummaryCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardCard>
      <div className="profile-summary-card">
        <h3 className="profile-summary-card__title">Your Profile</h3>
        <div className="profile-summary-card__items">
          <div className="profile-summary-card__item">
            <span className="profile-summary-card__label">Current Age</span>
            <span className="profile-summary-card__value">{age}</span>
          </div>
          <div className="profile-summary-card__item">
            <span className="profile-summary-card__label">Retirement Age</span>
            <span className="profile-summary-card__value">{retirementAge}</span>
          </div>
          <div className="profile-summary-card__item">
            <span className="profile-summary-card__label">Annual Salary</span>
            <span className="profile-summary-card__value">{formatCurrency(salary)}</span>
          </div>
          <div className="profile-summary-card__item">
            <span className="profile-summary-card__label">Risk Level</span>
            <span className="profile-summary-card__value">{riskLevel}</span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};
