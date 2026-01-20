import { DashboardCard } from "../dashboard/DashboardCard";

interface EmployerMatchDisplayProps {
  monthlyMatch: number;
  matchPercentage: number;
  matchCap: number;
  contributionAmount: number;
  contributionType: "percentage" | "fixed";
  salary: number;
}

/**
 * EmployerMatchDisplay - Read-only reinforcement of employer match
 * Shows employer monthly contribution and % of match captured
 */
export const EmployerMatchDisplay = ({
  monthlyMatch,
  matchPercentage,
  matchCap,
  contributionAmount,
  contributionType,
  salary,
}: EmployerMatchDisplayProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate % of match captured
  const matchCaptured = contributionType === "percentage"
    ? Math.min((contributionAmount / matchCap) * 100, 100)
    : ((contributionAmount * 12) / (salary * matchCap / 100)) * 100;

  return (
    <div className="employer-match-contextual">
      <p className="employer-match-contextual__text">
        Your employer adds <strong>{formatCurrency(monthlyMatch)}/month</strong> at this rate
      </p>
    </div>
  );
};
