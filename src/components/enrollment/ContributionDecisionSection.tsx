import { DashboardCard } from "../dashboard/DashboardCard";
import { Input } from "../ui/Input";
import { ContributionTypeToggle } from "./ContributionTypeToggle";
import Button from "../ui/Button";
import type { ContributionType } from "../../enrollment/logic/types";

interface ContributionDecisionSectionProps {
  contributionType: ContributionType;
  contributionAmount: number;
  salary: number;
  matchCap: number;
  matchPercentage: number;
  onTypeChange: (type: ContributionType) => void;
  onAmountChange: (amount: number) => void;
}

/**
 * ContributionDecisionSection - Primary decision section
 * Answers: "How much do I want to contribute from my paycheck?"
 */
export const ContributionDecisionSection = ({
  contributionType,
  contributionAmount,
  salary,
  matchCap,
  matchPercentage,
  onTypeChange,
  onAmountChange,
}: ContributionDecisionSectionProps) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onAmountChange(numValue);
    } else if (value === "") {
      onAmountChange(0);
    }
  };

  // Calculate monthly equivalent
  const monthlyEquivalent =
    contributionType === "percentage"
      ? (salary * contributionAmount) / 100 / 12
      : contributionAmount;

  // Calculate per-paycheck (assuming bi-weekly paychecks)
  const perPaycheck = monthlyEquivalent / 2;

  // Check if capturing full employer match
  const capturingFullMatch = contributionType === "percentage" && contributionAmount >= matchCap;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Quick presets: Safe / Match / Recommended / Max
  const quickPresets = [
    { label: "Safe", percentage: 3, id: "safe" },
    { label: "Match", percentage: 6, id: "match" },
    { label: "Recommended", percentage: 10, id: "recommended", recommended: true },
    { label: "Max", percentage: 15, id: "max" },
  ];

  const handlePresetClick = (percentage: number) => {
    onTypeChange("percentage");
    onAmountChange(percentage);
  };

  return (
    <DashboardCard>
      <div className="contribution-decision-section">
        <h2 className="contribution-decision-section__title">Set your contribution amount</h2>
        <div className="contribution-decision-section__controls">
          <ContributionTypeToggle contributionType={contributionType} onTypeChange={onTypeChange} />
          <Input
            label={contributionType === "percentage" ? "Contribution Percentage" : "Monthly Contribution"}
            type="number"
            name="contributionAmount"
            value={contributionAmount > 0 ? contributionAmount.toString() : ""}
            onChange={handleAmountChange}
            placeholder={contributionType === "percentage" ? "Enter percentage" : "Enter amount"}
            min="0"
            max={contributionType === "percentage" ? "100" : undefined}
            step={contributionType === "percentage" ? "0.1" : "100"}
            suffix={contributionType === "percentage" ? "%" : "$"}
          />
        </div>
        <div className="contribution-decision-section__helpers">
          <div className="contribution-decision-section__helper">
            <span className="contribution-decision-section__helper-label">Per paycheck:</span>
            <span className="contribution-decision-section__helper-value">{formatCurrency(perPaycheck)}</span>
          </div>
          {capturingFullMatch && (
            <div className="contribution-decision-section__helper contribution-decision-section__helper--success">
              <span className="contribution-decision-section__helper-icon" aria-hidden="true">✓</span>
              <span className="contribution-decision-section__helper-text">You are capturing full employer match</span>
            </div>
          )}
        </div>
        <div className="contribution-decision-section__presets">
          <span className="contribution-decision-section__presets-label">Quick presets:</span>
          <div className="contribution-decision-section__presets-buttons">
            {quickPresets.map((preset) => (
              <Button
                key={preset.percentage}
                onClick={() => handlePresetClick(preset.percentage)}
                className={`contribution-decision-section__preset-button ${preset.recommended ? "contribution-decision-section__preset-button--recommended" : ""}`}
                type="button"
              >
                {preset.label}
                {preset.recommended && (
                  <span className="contribution-decision-section__preset-badge">Recommended</span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};
