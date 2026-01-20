import { DashboardCard } from "../dashboard/DashboardCard";
import { Input } from "../ui/Input";
import { ContributionTypeToggle } from "./ContributionTypeToggle";
import type { ContributionSource, ContributionType } from "../../enrollment/logic/types";

interface ManualContributionAllocationProps {
  enabledSources: ContributionSource[];
  sourceAllocations: Record<ContributionSource, { type: ContributionType; amount: number }>;
  contributionType: ContributionType;
  contributionAmount: number;
  totalAllocation: number;
  allocationValid: boolean;
  onSourceToggle: (source: ContributionSource, enabled: boolean) => void;
  onSourceAllocationChange: (source: ContributionSource, type: ContributionType, amount: number) => void;
}

/**
 * ManualContributionAllocation - Unified card for manual source selection and allocation
 * All manual contribution source actions live inside this single card
 */
export const ManualContributionAllocation = ({
  enabledSources,
  sourceAllocations,
  contributionType,
  contributionAmount,
  totalAllocation,
  allocationValid,
  onSourceToggle,
  onSourceAllocationChange,
}: ManualContributionAllocationProps) => {
  const allSources: { value: ContributionSource; label: string; description: string; helperText: string }[] = [
    {
      value: "preTax",
      label: "Pre-tax",
      description: "Lower taxes today",
      helperText: "Reduces your taxable income now",
    },
    {
      value: "roth",
      label: "Roth",
      description: "Tax-free withdrawals later",
      helperText: "Tax-free withdrawals in retirement",
    },
    {
      value: "afterTax",
      label: "After-tax",
      description: "Additional savings",
      helperText: "Additional retirement savings beyond limits",
    },
  ];

  const hasMultipleSources = enabledSources.length > 1;
  const forcePercentageMode = hasMultipleSources;

  const handleAmountChange = (source: ContributionSource, value: string) => {
    const numValue = parseFloat(value);
    // For single source, use main contribution settings; for multiple, use allocations
    const allocation = enabledSources.length === 1 && enabledSources[0] === source
      ? { type: contributionType, amount: contributionAmount }
      : sourceAllocations[source];
    onSourceAllocationChange(
      source,
      allocation.type,
      isNaN(numValue) ? 0 : numValue
    );
  };

  return (
    <DashboardCard>
      <div className="manual-contribution-allocation">
        <h3 className="manual-contribution-allocation__title">Manual Contribution Allocation</h3>

        {/* Source Toggles */}
        <div className="manual-contribution-allocation__sources">
          {allSources.map((source) => {
            const isEnabled = enabledSources.includes(source.value);
            // For single source, use main contribution settings; for multiple, use allocations
            const allocation = isEnabled
              ? enabledSources.length === 1 && enabledSources[0] === source.value
                ? { type: contributionType, amount: contributionAmount }
                : sourceAllocations[source.value]
              : { type: "percentage" as ContributionType, amount: 0 };

            return (
              <div key={source.value} className="manual-contribution-allocation__source-row">
                <label className="manual-contribution-allocation__source-toggle">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => onSourceToggle(source.value, e.target.checked)}
                    className="manual-contribution-allocation__checkbox"
                  />
                  <div className="manual-contribution-allocation__source-info">
                    <span className="manual-contribution-allocation__source-label">{source.label}</span>
                    <span className="manual-contribution-allocation__source-description">{source.description}</span>
                  </div>
                </label>

                {/* Inline Allocation (progressive disclosure) */}
                {isEnabled && (
                  <div className="manual-contribution-allocation__allocation">
                    {!forcePercentageMode && (
                      <ContributionTypeToggle
                        contributionType={allocation.type}
                        onTypeChange={(type) => onSourceAllocationChange(source.value, type, allocation.amount)}
                      />
                    )}
                    {forcePercentageMode && (
                      <div className="manual-contribution-allocation__mode-note">
                        <span className="manual-contribution-allocation__mode-text">Percentage mode (multiple sources selected)</span>
                      </div>
                    )}
                    <Input
                      label={forcePercentageMode || allocation.type === "percentage" ? "Allocation Percentage" : "Monthly Amount"}
                      type="number"
                      name={`manual-allocation-${source.value}`}
                      value={allocation.amount > 0 ? allocation.amount.toString() : ""}
                      onChange={(e) => handleAmountChange(source.value, e.target.value)}
                      placeholder={forcePercentageMode || allocation.type === "percentage" ? "Enter percentage" : "Enter amount"}
                      min="0"
                      max={forcePercentageMode || allocation.type === "percentage" ? "100" : undefined}
                      step={forcePercentageMode || allocation.type === "percentage" ? "0.1" : "100"}
                      suffix={forcePercentageMode || allocation.type === "percentage" ? "%" : "$"}
                      helperText={source.helperText}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Total Validation (persistent) */}
        {enabledSources.length > 0 && (
          <div className="manual-contribution-allocation__validation">
            <div className="manual-contribution-allocation__total">
              <span className="manual-contribution-allocation__total-label">Total allocation:</span>
              <span
                className={`manual-contribution-allocation__total-value ${allocationValid ? "manual-contribution-allocation__total-value--valid" : "manual-contribution-allocation__total-value--invalid"}`}
              >
                {totalAllocation.toFixed(1)}%
              </span>
            </div>
            {!allocationValid && (
              <p className="manual-contribution-allocation__error" role="alert">
                {totalAllocation < 100
                  ? `Allocation must total 100%. Currently ${totalAllocation.toFixed(1)}%.`
                  : `Allocation exceeds 100%. Currently ${totalAllocation.toFixed(1)}%.`}
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardCard>
  );
};
