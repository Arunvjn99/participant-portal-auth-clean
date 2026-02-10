/**
 * Moderate investor chip – Tailwind-only component for the "MODERATE INVESTOR" badge
 * and the "Medium" risk level pill.
 */
interface ModerateInvestorChipProps {
  /** "badge" = MODERATE INVESTOR label; "pill" = Medium risk level */
  variant?: "badge" | "pill";
  /** Chip content */
  children: React.ReactNode;
  /** Optional extra class names */
  className?: string;
}

const variantClasses = {
  badge:
    "rounded-md bg-slate-200 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-800 dark:bg-slate-600 dark:text-slate-100",
  pill:
    "inline-block w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-semibold text-slate-700 dark:bg-slate-700/50 dark:text-slate-200",
} as const;

export const ModerateInvestorChip = ({
  variant = "pill",
  children,
  className = "",
}: ModerateInvestorChipProps) => {
  return (
    <span className={`${variantClasses[variant]} ${className}`.trim()}>
      {children}
    </span>
  );
};
