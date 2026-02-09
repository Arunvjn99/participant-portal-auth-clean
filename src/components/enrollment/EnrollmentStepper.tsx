interface EnrollmentStepperProps {
  currentStep: number;
  /** Page title - renders to right of radial per Figma */
  title?: string;
  /** Page subtitle - renders below title per Figma */
  subtitle?: string;
}

/**
 * EnrollmentStepper - Radial stepper per Figma (node 451-1642)
 * Circular progress ring (green arc, gray track), "X / Y" in center, optional title/subtitle to the right.
 */
export const EnrollmentStepper = ({ currentStep, title, subtitle }: EnrollmentStepperProps) => {
  const stepIndex = Math.min(Math.max(currentStep, 0), 4);
  const currentStepNum = stepIndex + 1;
  const totalSteps = 5;
  const progressFraction = currentStepNum / totalSteps;
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - progressFraction * circumference;

  return (
    <div
      className="enrollment-stepper enrollment-stepper--radial"
      role="progressbar"
      aria-valuenow={currentStepNum}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStepNum} of ${totalSteps}${title ? `: ${title}` : ""}`}
    >
      <div className="enrollment-stepper__radial">
        <div className="enrollment-stepper__ring-wrap">
          <svg
            className="enrollment-stepper__ring"
            viewBox="0 0 88 88"
            aria-hidden="true"
          >
            <circle
              className="enrollment-stepper__ring-track"
              cx="44"
              cy="44"
              r="36"
              fill="none"
              strokeWidth="6"
            />
            <circle
              className="enrollment-stepper__ring-fill"
              cx="44"
              cy="44"
              r="36"
              fill="none"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 44 44)"
            />
          </svg>
          <div className="enrollment-stepper__ring-center">
            <span className="enrollment-stepper__step-count">
              {currentStepNum} / {totalSteps}
            </span>
          </div>
        </div>

        {(title || subtitle) && (
          <div className="enrollment-stepper__header">
            {title && <h1 className="enrollment-stepper__title">{title}</h1>}
            {subtitle && <p className="enrollment-stepper__subtitle">{subtitle}</p>}
          </div>
        )}
      </div>
    </div>
  );
};
