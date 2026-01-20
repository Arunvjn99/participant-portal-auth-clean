import { Input } from "../ui/Input";
import type { Fund, Allocation } from "../../types/investment";

interface FundAllocationRowProps {
  fund: Fund;
  allocation: Allocation;
  disabled?: boolean;
  onAllocationChange: (percentage: number) => void;
}

/**
 * FundAllocationRow - Displays fund info with allocation slider and input
 */
export const FundAllocationRow = ({
  fund,
  allocation,
  disabled = false,
  onAllocationChange,
}: FundAllocationRowProps) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onAllocationChange(value);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onAllocationChange(Math.max(0, Math.min(100, value)));
    } else if (e.target.value === "") {
      onAllocationChange(0);
    }
  };

  const formatPercentage = (value: number) => {
    return value.toFixed(1);
  };

  return (
    <div className="fund-allocation-row">
      <div className="fund-allocation-row__info">
        <div className="fund-allocation-row__header">
          <h4 className="fund-allocation-row__name">{fund.name}</h4>
          <span className="fund-allocation-row__ticker">{fund.ticker}</span>
        </div>
        <div className="fund-allocation-row__details">
          <span className="fund-allocation-row__detail">
            <span className="fund-allocation-row__detail-label">Asset Class:</span>
            <span className="fund-allocation-row__detail-value">{fund.assetClass}</span>
          </span>
          <span className="fund-allocation-row__detail">
            <span className="fund-allocation-row__detail-label">Expense Ratio:</span>
            <span className="fund-allocation-row__detail-value">{fund.expenseRatio.toFixed(2)}%</span>
          </span>
          <span className="fund-allocation-row__detail">
            <span className="fund-allocation-row__detail-label">Risk Level:</span>
            <span className="fund-allocation-row__detail-value">{fund.riskLevel}/10</span>
          </span>
        </div>
      </div>
      <div className="fund-allocation-row__controls">
        <div className="fund-allocation-row__slider-wrapper">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={allocation.percentage}
            onChange={handleSliderChange}
            disabled={disabled}
            className="fund-allocation-row__slider"
            aria-label={`Allocation for ${fund.name}`}
          />
        </div>
        <div className="fund-allocation-row__input-wrapper">
          <Input
            type="number"
            name={`allocation-${fund.id}`}
            value={allocation.percentage > 0 ? formatPercentage(allocation.percentage) : ""}
            onChange={handleInputChange}
            min="0"
            max="100"
            step="0.1"
            disabled={disabled}
            suffix="%"
            className="fund-allocation-row__input"
          />
        </div>
      </div>
    </div>
  );
};
