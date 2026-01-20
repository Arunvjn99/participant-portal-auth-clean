import { DashboardCard } from "../dashboard/DashboardCard";
import type { RetirementImpactLevel } from "../../types/transactions";

interface RetirementImpactProps {
  level: RetirementImpactLevel;
  rationale: string;
}

export const RetirementImpact = ({ level, rationale }: RetirementImpactProps) => {
  const getLevelLabel = (level: RetirementImpactLevel): string => {
    switch (level) {
      case "low":
        return "Low Impact";
      case "medium":
        return "Medium Impact";
      case "high":
        return "High Impact";
    }
  };

  const getLevelClass = (level: RetirementImpactLevel): string => {
    return `retirement-impact--${level}`;
  };

  return (
    <DashboardCard title="Retirement Impact">
      <div className={`retirement-impact ${getLevelClass(level)}`}>
        <div className="retirement-impact__level">
          <span className="retirement-impact__label">{getLevelLabel(level)}</span>
        </div>
        <p className="retirement-impact__rationale">{rationale}</p>
      </div>
    </DashboardCard>
  );
};
