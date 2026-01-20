import { DashboardCard } from "../dashboard/DashboardCard";
import { FundAllocationRow } from "./FundAllocationRow";
import { useInvestment } from "../../context/InvestmentContext";
import { MOCK_FUNDS, getFundById } from "../../data/mockFunds";

/**
 * PlanDefaultBuilder - Displays recommended portfolio with optional edit toggle
 */
export const PlanDefaultBuilder = () => {
  const {
    planDefaultPortfolio,
    planDefaultEditEnabled,
    setPlanDefaultEditEnabled,
    draftAllocation,
    updateDraftAllocation,
  } = useInvestment();

  if (!planDefaultPortfolio) return null;

  return (
    <DashboardCard>
      <div className="plan-default-builder">
        <div className="plan-default-builder__header">
          <div>
            <h3 className="plan-default-builder__title">{planDefaultPortfolio.name}</h3>
            <p className="plan-default-builder__description">{planDefaultPortfolio.description}</p>
          </div>
          <label className="plan-default-builder__toggle">
            <input
              type="checkbox"
              checked={planDefaultEditEnabled}
              onChange={(e) => setPlanDefaultEditEnabled(e.target.checked)}
              className="plan-default-builder__toggle-input"
            />
            <span className="plan-default-builder__toggle-text">Allow me to edit allocation</span>
          </label>
        </div>
        <div className="plan-default-builder__funds">
          {draftAllocation
            .filter((allocation) => allocation.percentage > 0)
            .map((allocation) => {
              const fund = getFundById(allocation.fundId);
              if (!fund) return null;
              
              return (
                <FundAllocationRow
                  key={fund.id}
                  fund={fund}
                  allocation={allocation}
                  disabled={!planDefaultEditEnabled}
                  onAllocationChange={(percentage) => updateDraftAllocation(fund.id, percentage)}
                />
              );
            })}
        </div>
      </div>
    </DashboardCard>
  );
};
