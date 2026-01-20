/**
 * Calculate yearly contribution percentages with auto-increase applied
 * 
 * @param initialPercentage Starting contribution percentage (0-100)
 * @param increasePercentage Annual increase percentage (e.g., 1 = 1% increase per year)
 * @param maxPercentage Maximum contribution percentage cap (0-100)
 * @param years Number of years to project
 * @returns Array of contribution percentages for each year (index 0 = year 1)
 */
export const applyAutoIncrease = (
  initialPercentage: number,
  increasePercentage: number,
  maxPercentage: number,
  years: number
): number[] => {
  const percentages: number[] = [];
  let currentPercentage = initialPercentage;

  for (let year = 0; year < years; year++) {
    // Apply increase
    currentPercentage = currentPercentage * (1 + increasePercentage / 100);
    
    // Cap at maximum
    currentPercentage = Math.min(currentPercentage, maxPercentage);
    
    percentages.push(currentPercentage);
  }

  return percentages;
};
