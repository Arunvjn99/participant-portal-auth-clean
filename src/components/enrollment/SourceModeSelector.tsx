import { DashboardCard } from "../dashboard/DashboardCard";

export type SourceMode = "single" | "split" | "all";

interface SourceModeSelectorProps {
  mode: SourceMode;
  onModeChange: (mode: SourceMode) => void;
}

/**
 * SourceModeSelector - Allows user to choose contribution source allocation mode
 */
export const SourceModeSelector = ({ mode, onModeChange }: SourceModeSelectorProps) => {
  const modes: { value: SourceMode; label: string; description: string }[] = [
    {
      value: "single",
      label: "Single source",
      description: "Contribute from one source type",
    },
    {
      value: "split",
      label: "Split sources",
      description: "Allocate across multiple sources",
    },
    {
      value: "all",
      label: "All sources",
      description: "System optimized allocation",
    },
  ];

  return (
    <DashboardCard>
      <div className="source-mode-selector">
        <h3 className="source-mode-selector__title">Contribution Source</h3>
        <p className="source-mode-selector__description">
          Choose how you want to allocate your contributions across different source types.
        </p>
        <div className="source-mode-selector__options" role="radiogroup" aria-label="Contribution source mode">
          {modes.map((option) => (
            <label key={option.value} className="source-mode-selector__option">
              <input
                type="radio"
                name="sourceMode"
                value={option.value}
                checked={mode === option.value}
                onChange={() => onModeChange(option.value)}
                className="source-mode-selector__radio"
                aria-describedby={`source-mode-${option.value}-desc`}
              />
              <div className="source-mode-selector__option-content">
                <span className="source-mode-selector__option-label">{option.label}</span>
                <span id={`source-mode-${option.value}-desc`} className="source-mode-selector__option-description">
                  {option.description}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};
