import { DashboardCard } from "../dashboard/DashboardCard";
import { ManualContributionAllocation } from "./ManualContributionAllocation";
import type { ContributionSource, ContributionType } from "../../enrollment/logic/types";

interface SourceStrategySectionProps {
  allSourcesMode: boolean;
  onAllSourcesModeChange: (enabled: boolean) => void;
  manualMode: boolean;
  onManualModeChange: (enabled: boolean) => void;
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
 * SourceStrategySection - Progressive disclosure for contribution sources
 * Default: "Use all eligible sources automatically"
 * Secondary: "Choose sources manually"
 */
export const SourceStrategySection = ({
  allSourcesMode,
  onAllSourcesModeChange,
  manualMode,
  onManualModeChange,
  enabledSources,
  sourceAllocations,
  contributionType,
  contributionAmount,
  totalAllocation,
  allocationValid,
  onSourceToggle,
  onSourceAllocationChange,
}: SourceStrategySectionProps) => {
  return (
    <>
      <DashboardCard>
        <div className="source-strategy-section">
          <h3 className="source-strategy-section__title">Contribution Sources</h3>
          
          {/* Default option: Let the system choose best sources */}
          <div className="source-strategy-section__option">
            <label className="source-strategy-section__option-label">
              <input
                type="radio"
                name="sourceStrategy"
                checked={allSourcesMode && !manualMode}
                onChange={() => {
                  onAllSourcesModeChange(true);
                  onManualModeChange(false);
                }}
                className="source-strategy-section__radio"
              />
              <div className="source-strategy-section__option-content">
                <span className="source-strategy-section__option-title">
                  Let the system choose best sources <span className="source-strategy-section__recommended-badge">(Recommended)</span>
                </span>
                <span className="source-strategy-section__option-description">
                  The system will optimize your allocation across pre-tax, Roth, and after-tax sources based on your profile.
                </span>
              </div>
            </label>
          </div>

          {/* Secondary option: Choose sources manually */}
          <div className="source-strategy-section__option">
            <label className="source-strategy-section__option-label">
              <input
                type="radio"
                name="sourceStrategy"
                checked={!allSourcesMode && manualMode}
                onChange={() => {
                  onAllSourcesModeChange(false);
                  onManualModeChange(true);
                }}
                className="source-strategy-section__radio"
              />
              <div className="source-strategy-section__option-content">
                <span className="source-strategy-section__option-title">Choose sources manually</span>
                <span className="source-strategy-section__option-description">
                  Select and allocate your contribution across specific source types.
                </span>
              </div>
            </label>
          </div>

          {/* System-selected allocation preview (read-only) */}
          {allSourcesMode && !manualMode && (
            <div className="source-strategy-section__preview">
              <p className="source-strategy-section__preview-label">System allocation:</p>
              <div className="source-strategy-section__preview-items">
                <div className="source-strategy-section__preview-item">
                  <span className="source-strategy-section__preview-source">Pre-tax</span>
                  <span className="source-strategy-section__preview-percentage">~40%</span>
                </div>
                <div className="source-strategy-section__preview-item">
                  <span className="source-strategy-section__preview-source">Roth</span>
                  <span className="source-strategy-section__preview-percentage">~40%</span>
                </div>
                <div className="source-strategy-section__preview-item">
                  <span className="source-strategy-section__preview-source">After-tax</span>
                  <span className="source-strategy-section__preview-percentage">~20%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardCard>

      {/* Manual Contribution Allocation - Single unified card */}
      {manualMode && !allSourcesMode && (
        <ManualContributionAllocation
          enabledSources={enabledSources}
          sourceAllocations={sourceAllocations}
          contributionType={contributionType}
          contributionAmount={contributionAmount}
          totalAllocation={totalAllocation}
          allocationValid={allocationValid}
          onSourceToggle={onSourceToggle}
          onSourceAllocationChange={onSourceAllocationChange}
        />
      )}
    </>
  );
};
