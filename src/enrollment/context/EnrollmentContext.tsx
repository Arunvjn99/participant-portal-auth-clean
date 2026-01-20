import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import type {
  ContributionType,
  ContributionSource,
  ContributionInput,
  MonthlyContribution,
  ProjectionComparison,
  AutoIncreaseSettings,
  ContributionAssumptions,
} from "../logic/types";
import { calculateMonthlyContribution } from "../logic/contributionCalculator";
import { calculateProjection } from "../logic/projectionCalculator";
import { getProjectionDelta } from "../logic/projectionDelta";

// Normalized plan IDs - stable enum values
export type SelectedPlanId = "traditional_401k" | "roth_401k" | "roth_ira" | null;

interface EnrollmentState {
  // Plan selection
  selectedPlan: SelectedPlanId;
  isInitialized: boolean;
  
  // Contribution inputs
  salary: number;
  contributionType: ContributionType;
  contributionAmount: number;
  contributionSource: ContributionSource[];
  employerMatchEnabled: boolean;
  
  // Auto-increase settings
  autoIncrease: AutoIncreaseSettings;
  
  // Assumptions
  assumptions: ContributionAssumptions;
  
  // Profile data (from previous steps)
  currentAge: number;
  retirementAge: number;
  currentBalance: number;
}

interface EnrollmentContextValue {
  // State
  state: EnrollmentState;
  
  // Setters
  setSelectedPlan: (planId: SelectedPlanId) => void;
  setSalary: (salary: number) => void;
  setContributionType: (type: ContributionType) => void;
  setContributionAmount: (amount: number) => void;
  setContributionSource: (sources: ContributionSource[]) => void;
  setEmployerMatchEnabled: (enabled: boolean) => void;
  setAutoIncrease: (settings: AutoIncreaseSettings) => void;
  setAssumptions: (assumptions: ContributionAssumptions) => void;
  
  // Derived values
  monthlyContribution: MonthlyContribution;
  projectionData: ProjectionComparison;
  projectionDelta: {
    deltaAmount: number;
    deltaPercentage: number;
  };
}

const EnrollmentContext = createContext<EnrollmentContextValue | undefined>(undefined);

interface EnrollmentProviderProps {
  children: ReactNode;
  initialSalary?: number;
  initialContributionType?: ContributionType;
  initialContributionAmount?: number;
  initialAge?: number;
  initialRetirementAge?: number;
  initialBalance?: number;
}

export const EnrollmentProvider = ({
  children,
  initialSalary = 0,
  initialContributionType = "percentage",
  initialContributionAmount = 0,
  initialAge = 30,
  initialRetirementAge = 65,
  initialBalance = 0,
}: EnrollmentProviderProps) => {
  const [state, setState] = useState<EnrollmentState>({
    selectedPlan: null,
    isInitialized: true, // Mark as initialized after first render
    salary: initialSalary,
    contributionType: initialContributionType,
    contributionAmount: initialContributionAmount,
    contributionSource: ["preTax"],
    employerMatchEnabled: true,
    autoIncrease: {
      enabled: false,
      percentage: 1,
      maxPercentage: 15,
    },
    assumptions: {
      employerMatchPercentage: 50,
      employerMatchCap: 6,
      annualReturnRate: 7,
      inflationRate: 2.5,
    },
    currentAge: initialAge,
    retirementAge: initialRetirementAge,
    currentBalance: initialBalance,
  });

  // Derived values using pure functions
  const monthlyContribution = useMemo(() => {
    const input: ContributionInput = {
      salary: state.salary,
      contributionType: state.contributionType,
      contributionAmount: state.contributionAmount,
      source: state.contributionSource[0], // Use first selected source
    };
    const assumptions = {
      ...state.assumptions,
      employerMatchPercentage: state.employerMatchEnabled
        ? state.assumptions.employerMatchPercentage
        : 0,
    };
    return calculateMonthlyContribution(input, assumptions);
  }, [
    state.salary,
    state.contributionType,
    state.contributionAmount,
    state.contributionSource,
    state.employerMatchEnabled,
    state.assumptions,
  ]);

  const projectionData = useMemo(() => {
    const baseInput = {
      currentAge: state.currentAge,
      retirementAge: state.retirementAge,
      currentBalance: state.currentBalance,
      monthlyContribution: monthlyContribution.employee,
      employerMatch: monthlyContribution.employer,
      annualReturnRate: state.assumptions.annualReturnRate,
      inflationRate: state.assumptions.inflationRate,
    };

    // Calculate baseline projection (no auto-increase)
    const baseline = calculateProjection(baseInput);

    // Calculate projection with auto-increase if enabled
    const withAutoIncrease = calculateProjection({
      ...baseInput,
      autoIncrease: state.autoIncrease.enabled && state.contributionType === "percentage"
        ? {
            enabled: true,
            initialPercentage: state.contributionAmount,
            increasePercentage: state.autoIncrease.percentage,
            maxPercentage: state.autoIncrease.maxPercentage,
            salary: state.salary,
            contributionType: state.contributionType,
            assumptions: state.assumptions,
          }
        : undefined,
    });

    return {
      baseline,
      withAutoIncrease,
    };
  }, [
    state.currentAge,
    state.retirementAge,
    state.currentBalance,
    monthlyContribution.employee,
    monthlyContribution.employer,
    state.assumptions,
    state.autoIncrease,
    state.contributionType,
    state.contributionAmount,
    state.salary,
  ]);

  const projectionDelta = useMemo(() => {
    return getProjectionDelta(projectionData.baseline, projectionData.withAutoIncrease);
  }, [projectionData]);

  const value: EnrollmentContextValue = {
    state,
    setSelectedPlan: (planId) => setState((prev) => ({ ...prev, selectedPlan: planId })),
    setSalary: (salary) => setState((prev) => ({ ...prev, salary })),
    setContributionType: (type) => setState((prev) => ({ ...prev, contributionType: type })),
    setContributionAmount: (amount) => setState((prev) => ({ ...prev, contributionAmount: amount })),
    setContributionSource: (sources) => setState((prev) => ({ ...prev, contributionSource: sources })),
    setEmployerMatchEnabled: (enabled) => setState((prev) => ({ ...prev, employerMatchEnabled: enabled })),
    setAutoIncrease: (settings) => setState((prev) => ({ ...prev, autoIncrease: settings })),
    setAssumptions: (assumptions) => setState((prev) => ({ ...prev, assumptions })),
    monthlyContribution,
    projectionData,
    projectionDelta,
  };

  return <EnrollmentContext.Provider value={value}>{children}</EnrollmentContext.Provider>;
};

export const useEnrollment = (): EnrollmentContextValue => {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error("useEnrollment must be used within EnrollmentProvider");
  }
  return context;
};
