import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import type { InvestmentStrategy, Allocation, PlanDefaultPortfolio } from "../types/investment";
import { getAllocationState } from "../utils/allocationHelpers";
import { MOCK_FUNDS } from "../data/mockFunds";

interface InvestmentContextValue {
  // Strategy
  selectedStrategy: InvestmentStrategy;
  setSelectedStrategy: (strategy: InvestmentStrategy) => void;
  
  // Allocations
  currentAllocation: Allocation[];
  draftAllocation: Allocation[];
  setDraftAllocation: (allocation: Allocation[]) => void;
  updateDraftAllocation: (fundId: string, percentage: number) => void;
  
  // Plan default
  planDefaultPortfolio: PlanDefaultPortfolio | null;
  planDefaultEditEnabled: boolean;
  setPlanDefaultEditEnabled: (enabled: boolean) => void;
  
  // Validation
  allocationState: ReturnType<typeof getAllocationState>;
  
  // Actions
  resetDraftAllocation: () => void;
  confirmAllocation: () => void;
}

const InvestmentContext = createContext<InvestmentContextValue | undefined>(undefined);

interface InvestmentProviderProps {
  children: ReactNode;
}

/**
 * Default plan portfolio (recommended allocation)
 */
const DEFAULT_PLAN_PORTFOLIO: PlanDefaultPortfolio = {
  name: "Balanced Growth Portfolio",
  description: "A diversified portfolio designed for long-term growth with moderate risk",
  allocations: [
    { fundId: "fund-1", percentage: 40 }, // S&P 500
    { fundId: "fund-5", percentage: 20 }, // International
    { fundId: "fund-7", percentage: 30 }, // Bonds
    { fundId: "fund-9", percentage: 10 }, // REIT
  ],
  expectedReturn: 8.5,
  totalFees: 0.05,
  riskLevel: 5,
};

export const InvestmentProvider = ({ children }: InvestmentProviderProps) => {
  const [selectedStrategy, setSelectedStrategy] = useState<InvestmentStrategy>("planDefault");
  const [currentAllocation, setCurrentAllocation] = useState<Allocation[]>(DEFAULT_PLAN_PORTFOLIO.allocations);
  const [draftAllocation, setDraftAllocation] = useState<Allocation[]>(DEFAULT_PLAN_PORTFOLIO.allocations);
  const [planDefaultEditEnabled, setPlanDefaultEditEnabled] = useState(false);

  // Calculate allocation state
  const allocationState = useMemo(() => {
    return getAllocationState(draftAllocation);
  }, [draftAllocation]);

  // Handle strategy change - reset draft allocation
  const handleStrategyChange = (strategy: InvestmentStrategy) => {
    setSelectedStrategy(strategy);
    
    if (strategy === "planDefault") {
      setDraftAllocation([...DEFAULT_PLAN_PORTFOLIO.allocations]);
      setPlanDefaultEditEnabled(false);
    } else if (strategy === "manual") {
      // Start with empty allocation for manual mode
      setDraftAllocation([]);
    } else if (strategy === "advisor") {
      // Advisor view uses current allocation (read-only)
      setDraftAllocation([...currentAllocation]);
    }
  };

  // Update single fund allocation
  const updateDraftAllocation = (fundId: string, percentage: number) => {
    setDraftAllocation((prev) => {
      const existing = prev.findIndex((a) => a.fundId === fundId);
      if (existing >= 0) {
        // Update existing
        const updated = [...prev];
        updated[existing] = { fundId, percentage };
        return updated;
      } else {
        // Add new
        return [...prev, { fundId, percentage }];
      }
    });
  };

  // Reset draft to current
  const resetDraftAllocation = () => {
    setDraftAllocation([...currentAllocation]);
  };

  // Confirm allocation (save draft as current)
  const confirmAllocation = () => {
    if (allocationState.isValid) {
      setCurrentAllocation([...draftAllocation]);
    }
  };

  const value: InvestmentContextValue = {
    selectedStrategy,
    setSelectedStrategy: handleStrategyChange,
    currentAllocation,
    draftAllocation,
    setDraftAllocation,
    updateDraftAllocation,
    planDefaultPortfolio: DEFAULT_PLAN_PORTFOLIO,
    planDefaultEditEnabled,
    setPlanDefaultEditEnabled,
    allocationState,
    resetDraftAllocation,
    confirmAllocation,
  };

  return <InvestmentContext.Provider value={value}>{children}</InvestmentContext.Provider>;
};

export const useInvestment = (): InvestmentContextValue => {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error("useInvestment must be used within InvestmentProvider");
  }
  return context;
};
