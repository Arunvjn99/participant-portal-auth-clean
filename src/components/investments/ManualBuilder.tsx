import { useState, useMemo } from "react";
import { DashboardCard } from "../dashboard/DashboardCard";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import { FundAllocationRow } from "./FundAllocationRow";
import { useInvestment } from "../../context/InvestmentContext";
import { MOCK_FUNDS } from "../../data/mockFunds";
import type { Fund } from "../../types/investment";

/**
 * ManualBuilder - Allows searching and adding funds with fully editable allocations
 */
export const ManualBuilder = () => {
  const { draftAllocation, updateDraftAllocation, setDraftAllocation } = useInvestment();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter funds based on search
  const filteredFunds = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_FUNDS;
    
    const query = searchQuery.toLowerCase();
    return MOCK_FUNDS.filter(
      (fund) =>
        fund.name.toLowerCase().includes(query) ||
        fund.ticker.toLowerCase().includes(query) ||
        fund.assetClass.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Get funds currently in allocation
  const allocatedFundIds = new Set(draftAllocation.map((a) => a.fundId));
  const availableFunds = filteredFunds.filter((fund) => !allocatedFundIds.has(fund.id));
  const allocatedFunds = draftAllocation
    .map((allocation) => {
      const fund = MOCK_FUNDS.find((f) => f.id === allocation.fundId);
      return fund ? { fund, allocation } : null;
    })
    .filter((item): item is { fund: Fund; allocation: typeof draftAllocation[0] } => item !== null);

  const handleAddFund = (fundId: string) => {
    // Add fund with 0% allocation
    updateDraftAllocation(fundId, 0);
  };

  const handleRemoveFund = (fundId: string) => {
    setDraftAllocation((prev) => prev.filter((a) => a.fundId !== fundId));
  };

  return (
    <div className="manual-builder">
      <DashboardCard>
        <div className="manual-builder__search">
          <Input
            label="Search funds"
            type="text"
            name="fund-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ticker, or asset class"
          />
        </div>
      </DashboardCard>

      {allocatedFunds.length > 0 && (
        <DashboardCard>
          <div className="manual-builder__allocated">
            <h3 className="manual-builder__section-title">Your Allocation</h3>
            <div className="manual-builder__funds">
              {allocatedFunds.map(({ fund, allocation }) => (
                <div key={fund.id} className="manual-builder__fund-row">
                  <FundAllocationRow
                    fund={fund}
                    allocation={allocation}
                    disabled={false}
                    onAllocationChange={(percentage) => updateDraftAllocation(fund.id, percentage)}
                  />
                  <Button
                    onClick={() => handleRemoveFund(fund.id)}
                    className="manual-builder__remove-button"
                    type="button"
                    aria-label={`Remove ${fund.name}`}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      )}

      {availableFunds.length > 0 && (
        <DashboardCard>
          <div className="manual-builder__available">
            <h3 className="manual-builder__section-title">Available Funds</h3>
            <div className="manual-builder__fund-list">
              {availableFunds.map((fund) => (
                <div key={fund.id} className="manual-builder__fund-item">
                  <div className="manual-builder__fund-info">
                    <div className="manual-builder__fund-header">
                      <span className="manual-builder__fund-name">{fund.name}</span>
                      <span className="manual-builder__fund-ticker">{fund.ticker}</span>
                    </div>
                    <div className="manual-builder__fund-details">
                      <span>{fund.assetClass}</span>
                      <span>•</span>
                      <span>{fund.expenseRatio.toFixed(2)}% fee</span>
                      <span>•</span>
                      <span>Risk {fund.riskLevel}/10</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddFund(fund.id)}
                    className="manual-builder__add-button"
                    type="button"
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      )}

      {filteredFunds.length === 0 && (
        <DashboardCard>
          <div className="manual-builder__empty">
            <p>No funds found matching "{searchQuery}"</p>
          </div>
        </DashboardCard>
      )}
    </div>
  );
};
