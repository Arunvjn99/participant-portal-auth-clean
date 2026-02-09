/**
 * Shared Y-axis logic for projection charts (Contribution + Auto Increase pages).
 * Ensures consistent formatting and tick generation across both charts.
 */

/** Preferred number of Y-axis ticks */
const PREFERRED_TICKS = 5;

/** Nice step values for monetary scale (ascending) */
const NICE_STEPS = [1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000, 2500000, 5000000];

/**
 * Generate evenly spaced Y-axis ticks for a given max value.
 * Returns values from 0 up to a nice ceiling, with 4–6 ticks.
 */
export function getYAxisTicks(maxVal: number, preferredTicks = PREFERRED_TICKS): number[] {
  if (maxVal <= 0) return [0];

  const rawMax = Math.max(maxVal, 1000);
  let step = NICE_STEPS[0];
  for (const s of NICE_STEPS) {
    if (rawMax / s <= preferredTicks + 1) {
      step = s;
      break;
    }
  }

  const ceiling = Math.ceil(rawMax / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= ceiling; v += step) {
    ticks.push(v);
  }
  if (ticks.length < 3) {
    ticks.push(ticks[ticks.length - 1] + step);
  }
  return ticks;
}

/**
 * Format a monetary value for Y-axis display.
 * Uses k for thousands, M for millions. No decimals for whole numbers.
 */
export function formatYAxisLabel(value: number): string {
  if (value === 0) return "$0";
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return m >= 1 && m === Math.floor(m) ? `$${m}M` : `$${m.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return k >= 1 && k === Math.floor(k) ? `$${k}k` : `$${k.toFixed(1)}k`;
  }
  return `$${value}`;
}
