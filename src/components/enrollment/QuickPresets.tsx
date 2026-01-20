interface QuickPreset {
  id: string;
  label: string;
  percentage: number;
}

interface QuickPresetsProps {
  presets: QuickPreset[];
  selectedPresetId?: string;
  onPresetSelect: (preset: QuickPreset) => void;
}

export const QuickPresets = ({
  presets,
  selectedPresetId,
  onPresetSelect,
}: QuickPresetsProps) => {
  return (
    <div className="quick-presets" role="group" aria-label="Quick contribution presets">
      {presets.map((preset) => (
        <button
          key={preset.id}
          type="button"
          className={`quick-presets__pill ${selectedPresetId === preset.id ? "quick-presets__pill--selected" : ""}`}
          onClick={() => onPresetSelect(preset)}
          aria-pressed={selectedPresetId === preset.id}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
};
