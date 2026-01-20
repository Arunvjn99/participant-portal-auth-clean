import type { ContributionPreset } from "./types";

/**
 * Predefined contribution rate presets
 * TODO: Make these configurable or fetch from API
 */
export const CONTRIBUTION_PRESETS: ContributionPreset[] = [
  {
    id: "min",
    label: "Minimum (3%)",
    percentage: 3,
  },
  {
    id: "match",
    label: "Match (6%)",
    percentage: 6,
  },
  {
    id: "recommended",
    label: "Recommended (10%)",
    percentage: 10,
  },
  {
    id: "max",
    label: "Maximum (15%)",
    percentage: 15,
  },
];

/**
 * Get preset by ID
 */
export const getPresetById = (id: string): ContributionPreset | undefined => {
  return CONTRIBUTION_PRESETS.find((preset) => preset.id === id);
};

/**
 * Find closest preset to a given percentage
 */
export const findClosestPreset = (percentage: number): ContributionPreset | undefined => {
  // TODO: Implement logic to find closest preset
  return CONTRIBUTION_PRESETS.find((preset) => preset.percentage === percentage);
};

/**
 * Quick preset options for contribution strategy
 */
export const QUICK_PRESETS: ContributionPreset[] = [
  {
    id: "safe",
    label: "Safe",
    percentage: 6,
  },
  {
    id: "aggressive",
    label: "Aggressive",
    percentage: 15,
  },
];
