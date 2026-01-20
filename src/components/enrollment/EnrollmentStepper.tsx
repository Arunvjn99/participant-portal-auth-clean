interface EnrollmentStepperProps {
  currentStep: number;
}

/**
 * EnrollmentStepper - Displays enrollment progress
 * Shows 4 steps: Plan Selection, Contribution, Investments, Review
 */
export const EnrollmentStepper = ({ currentStep }: EnrollmentStepperProps) => {
  const steps = [
    { label: "Plan Selection", step: 0 },
    { label: "Contribution", step: 1 },
    { label: "Investments", step: 2 },
    { label: "Review", step: 3 },
  ];

  const getStepStatus = (stepIndex: number): "completed" | "active" | "upcoming" => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "active";
    return "upcoming";
  };

  // Calculate progress percentage for filled connector
  const progressPercentage = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="enrollment-stepper" role="progressbar" aria-label="Enrollment progress">
      <div className="enrollment-stepper__steps">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          
          return (
            <div
              key={index}
              className={`enrollment-stepper__step enrollment-stepper__step--${status}`}
            >
              <div className="enrollment-stepper__step-indicator">
                {status === "completed" && (
                  <span className="enrollment-stepper__checkmark" aria-hidden="true">✓</span>
                )}
                {status === "active" && (
                  <span className="enrollment-stepper__step-number">{index + 1}</span>
                )}
                {status === "upcoming" && (
                  <span className="enrollment-stepper__step-number">{index + 1}</span>
                )}
              </div>
              <span className="enrollment-stepper__step-label">{step.label}</span>
            </div>
          );
        })}
        <div
          className="enrollment-stepper__progress-fill"
          style={{ width: `${progressPercentage}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
