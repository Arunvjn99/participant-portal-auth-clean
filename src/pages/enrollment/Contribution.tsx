import { useState, useMemo } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { useEnrollment } from "../../enrollment/context/EnrollmentContext";
import { EnrollmentStepper } from "../../components/enrollment/EnrollmentStepper";
import { ContributionDecisionSection } from "../../components/enrollment/ContributionDecisionSection";
import { SourceStrategySection } from "../../components/enrollment/SourceStrategySection";
import { EmployerMatchDisplay } from "../../components/enrollment/EmployerMatchDisplay";
import { AutoIncreasePanel } from "../../components/enrollment/AutoIncreasePanel";
import { ProjectionChart } from "../../components/enrollment/ProjectionChart";
import Button from "../../components/ui/Button";
import type { ContributionSource, ContributionType } from "../../enrollment/logic/types";
import type { SelectedPlanId } from "../../enrollment/context/EnrollmentContext";

// Plan name mapping - maps normalized plan IDs to display names
const PLAN_NAMES: Record<SelectedPlanId, string> = {
  traditional_401k: "Traditional 401(k)",
  roth_401k: "Roth 401(k)",
  roth_ira: "Roth IRA",
  null: "",
};

export const Contribution = () => {
  const navigate = useNavigate();
  const {
    state,
    setContributionType,
    setContributionAmount,
    setContributionSource,
    setAutoIncrease,
    monthlyContribution,
    projectionData,
    projectionDelta,
  } = useEnrollment();

  // Get selected plan from enrollment state
  const selectedPlanId = state.selectedPlan;
  const selectedPlanName = selectedPlanId ? PLAN_NAMES[selectedPlanId] : null;

  // Guard: Only redirect if state is initialized AND no plan is selected
  if (state.isInitialized && !selectedPlanId) {
    return <Navigate to="/enrollment/choose-plan" replace />;
  }

  // Source strategy state
  const [allSourcesMode, setAllSourcesMode] = useState(true); // Default to auto mode
  const [manualMode, setManualMode] = useState(false);

  // Enabled sources state (only used in manual mode) - toggle-based instead of add/remove
  const [enabledSources, setEnabledSources] = useState<ContributionSource[]>(["preTax"]);

  // Source allocations state - tracks type and amount for each selected source
  const [sourceAllocations, setSourceAllocations] = useState<
    Record<ContributionSource, { type: ContributionType; amount: number }>
  >({
    preTax: { type: state.contributionType, amount: state.contributionAmount },
    roth: { type: "percentage", amount: 0 },
    afterTax: { type: "percentage", amount: 0 },
  });

  // Check if multiple sources are enabled
  const hasMultipleSources = enabledSources.length > 1;

  // Calculate total allocation percentage (for validation)
  const totalAllocation = useMemo(() => {
    if (!hasMultipleSources) return 100; // Single source doesn't need validation
    return enabledSources.reduce((sum, source) => {
      const allocation = sourceAllocations[source];
      return sum + (allocation.type === "percentage" ? allocation.amount : 0);
    }, 0);
  }, [enabledSources, sourceAllocations, hasMultipleSources]);

  // Validation: multiple sources must total 100%
  const allocationValid = !hasMultipleSources || totalAllocation === 100;

  // Handle all sources mode change
  const handleAllSourcesModeChange = (enabled: boolean) => {
    setAllSourcesMode(enabled);
    if (enabled) {
      setManualMode(false);
      setEnabledSources([]);
      setContributionSource(["preTax", "roth", "afterTax"]);
    } else {
      // When disabling all sources mode, enable manual mode
      setManualMode(true);
      if (enabledSources.length === 0) {
        setEnabledSources(["preTax"]);
        setContributionSource(["preTax"]);
      } else {
        setContributionSource(enabledSources);
      }
    }
  };

  // Handle manual mode change
  const handleManualModeChange = (enabled: boolean) => {
    setManualMode(enabled);
    if (enabled) {
      setAllSourcesMode(false);
      if (enabledSources.length === 0) {
        setEnabledSources(["preTax"]);
        setContributionSource(["preTax"]);
      } else {
        setContributionSource(enabledSources);
      }
    } else {
      // When disabling manual mode, enable all sources mode
      setAllSourcesMode(true);
      setEnabledSources([]);
      setContributionSource(["preTax", "roth", "afterTax"]);
    }
  };

  // Handle source toggle (replaces add/remove)
  const handleSourceToggle = (source: ContributionSource, enabled: boolean) => {
    if (allSourcesMode || !manualMode) return;

    let newEnabledSources: ContributionSource[];
    if (enabled) {
      // Enable source
      newEnabledSources = [...enabledSources, source];
      
      // If this is the second source, switch all to percentage mode
      if (newEnabledSources.length === 2) {
        const updatedAllocations = { ...sourceAllocations };
        newEnabledSources.forEach((s) => {
          if (updatedAllocations[s].type === "fixed") {
            updatedAllocations[s] = { type: "percentage", amount: 50 };
          }
        });
        setSourceAllocations(updatedAllocations);
      }

      // Initialize allocation for new source
      if (newEnabledSources.length === 1) {
        setSourceAllocations({
          ...sourceAllocations,
          [source]: { type: state.contributionType, amount: state.contributionAmount },
        });
      } else {
        // Distribute allocation evenly or set to 0
        const perSource = 100 / newEnabledSources.length;
        const updatedAllocations = { ...sourceAllocations };
        newEnabledSources.forEach((s) => {
          if (!enabledSources.includes(s)) {
            updatedAllocations[s] = { type: "percentage", amount: perSource };
          }
        });
        setSourceAllocations(updatedAllocations);
      }
    } else {
      // Disable source (but keep at least one enabled)
      if (enabledSources.length === 1) return; // Can't disable last source
      newEnabledSources = enabledSources.filter((s) => s !== source);
    }

    setEnabledSources(newEnabledSources);
    setContributionSource(newEnabledSources);
  };

  // Handle source allocation change
  const handleSourceAllocationChange = (
    source: ContributionSource,
    type: ContributionType,
    amount: number
  ) => {
    if (allSourcesMode || !manualMode) return;

    // If single source, update main contribution settings directly
    if (enabledSources.length === 1 && enabledSources[0] === source) {
      setContributionType(type);
      setContributionAmount(amount);
      setSourceAllocations({
        ...sourceAllocations,
        [source]: { type, amount },
      });
    } else {
      // Multiple sources: update allocations only
      setSourceAllocations({
        ...sourceAllocations,
        [source]: { type, amount },
      });
    }

    setContributionSource(enabledSources);
  };

  const handleNext = () => {
    // Prevent navigation if allocation is invalid
    if (manualMode && !allSourcesMode && !allocationValid) {
      return;
    }
    navigate("/enrollment/investments");
  };

  const handleSaveAndExit = () => {
    // TODO: Save enrollment data
    navigate("/dashboard");
  };

  const handleBack = () => {
    navigate("/enrollment/choose-plan");
  };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="contribution-page">
        {/* Enrollment Stepper */}
        <div className="contribution-page__stepper">
          <EnrollmentStepper currentStep={1} />
        </div>

        {/* Selected Plan Context */}
        {selectedPlanName && (
          <div className="contribution-page__plan-context">
            <div className="contribution-page__plan-context-content">
              <span className="contribution-page__plan-context-label">Selected plan</span>
              <span className="contribution-page__plan-context-value">{selectedPlanName}</span>
              <span className="contribution-page__plan-context-subtext">
                You can change this before final review
              </span>
            </div>
          </div>
        )}

        <div className="contribution-page__header">
          <button
            type="button"
            onClick={handleBack}
            className="contribution-page__back-button"
            aria-label="Back to choose plan"
          >
            <span className="contribution-page__back-icon" aria-hidden="true">←</span>
            <span className="contribution-page__back-text">Back</span>
          </button>
          <h1 className="contribution-page__title">Set Your Contribution</h1>
          <p className="contribution-page__description">
            Choose how much you want to contribute from your paycheck each month.
          </p>
        </div>
        <div className="contribution-page__content">
          <div className="contribution-page__left">
            {/* 1. PRIMARY SECTION — "Set your contribution amount" */}
            <ContributionDecisionSection
              contributionType={state.contributionType}
              contributionAmount={state.contributionAmount}
              salary={state.salary}
              matchCap={state.assumptions.employerMatchCap}
              matchPercentage={state.assumptions.employerMatchPercentage}
              onTypeChange={setContributionType}
              onAmountChange={setContributionAmount}
            />

            {/* 2. CONTRIBUTION SOURCES — Progressive Disclosure */}
            <SourceStrategySection
              allSourcesMode={allSourcesMode}
              onAllSourcesModeChange={handleAllSourcesModeChange}
              manualMode={manualMode}
              onManualModeChange={handleManualModeChange}
              enabledSources={enabledSources}
              sourceAllocations={sourceAllocations}
              contributionType={state.contributionType}
              contributionAmount={state.contributionAmount}
              totalAllocation={totalAllocation}
              allocationValid={allocationValid}
              onSourceToggle={handleSourceToggle}
              onSourceAllocationChange={handleSourceAllocationChange}
            />

            {/* 3. EMPLOYER MATCH — Contextual only */}
            <EmployerMatchDisplay
              monthlyMatch={monthlyContribution.employer}
              matchPercentage={state.assumptions.employerMatchPercentage}
              matchCap={state.assumptions.employerMatchCap}
              contributionAmount={state.contributionAmount}
              contributionType={state.contributionType}
              salary={state.salary}
            />

            {/* 4. AUTO-INCREASE — Future-focused option */}
            <AutoIncreasePanel
              autoIncrease={state.autoIncrease}
              onSettingsChange={setAutoIncrease}
              deltaAmount={state.autoIncrease.enabled ? projectionDelta.deltaAmount : undefined}
            />
          </div>
          <div className="contribution-page__right">
            {/* CONFIDENCE SECTION — Retirement Projection (side card) */}
            <ProjectionChart
              projectionData={projectionData}
              currentAge={state.currentAge}
              retirementAge={state.retirementAge}
            />
          </div>
        </div>
        {/* STICKY SUMMARY FOOTER */}
        <div className="contribution-page__footer contribution-page__footer--sticky">
          <div className="contribution-page__footer-summary">
            <div className="contribution-page__footer-summary-item">
              <span className="contribution-page__footer-summary-label">Your monthly contribution</span>
              <span className="contribution-page__footer-summary-value">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(monthlyContribution.employee)}
              </span>
            </div>
            {monthlyContribution.employer > 0 && (
              <div className="contribution-page__footer-summary-item">
                <span className="contribution-page__footer-summary-label">Employer contribution</span>
                <span className="contribution-page__footer-summary-value">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(monthlyContribution.employer)}
                </span>
              </div>
            )}
            <div className="contribution-page__footer-summary-item contribution-page__footer-summary-item--total">
              <span className="contribution-page__footer-summary-label">Total monthly investment</span>
              <span className="contribution-page__footer-summary-value">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(monthlyContribution.total)}
              </span>
            </div>
          </div>
          <div className="contribution-page__footer-actions">
            <Button
              onClick={handleSaveAndExit}
              className="contribution-page__cta contribution-page__cta--secondary"
              type="button"
            >
              Save & exit
            </Button>
            <Button
              onClick={handleNext}
              className="contribution-page__cta contribution-page__cta--primary"
              disabled={manualMode && !allSourcesMode && !allocationValid}
            >
              Continue to Investments
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
