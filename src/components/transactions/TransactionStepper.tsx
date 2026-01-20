interface TransactionStepperProps {
  milestones: {
    submitted?: string;
    processing?: string;
    completed?: string;
  };
  status: "draft" | "active" | "completed" | "cancelled";
}

export const TransactionStepper = ({ milestones, status }: TransactionStepperProps) => {
  const steps = [
    { key: "submitted", label: "Submitted", date: milestones.submitted },
    { key: "processing", label: "Processing", date: milestones.processing },
    { key: "completed", label: "Completed", date: milestones.completed },
  ];

  const getStepStatus = (stepKey: string, stepDate?: string): "completed" | "active" | "pending" => {
    if (!stepDate) return "pending";
    if (stepKey === "completed" && status === "completed") return "completed";
    if (stepKey === "processing" && status === "active") return "active";
    if (stepKey === "submitted" && status !== "draft") return "completed";
    if (stepKey === "processing" && status === "completed") return "completed";
    return stepDate ? "completed" : "pending";
  };

  return (
    <div className="transaction-stepper" role="progressbar" aria-label="Transaction timeline">
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(step.key, step.date);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.key} className="transaction-stepper__step">
            <div className={`transaction-stepper__step-content ${stepStatus !== "pending" ? "transaction-stepper__step-content--active" : ""}`}>
              <div className={`transaction-stepper__indicator transaction-stepper__indicator--${stepStatus}`}>
                {stepStatus === "completed" && <span aria-hidden="true">✓</span>}
              </div>
              <div className="transaction-stepper__label-group">
                <span className="transaction-stepper__label">{step.label}</span>
                {step.date && (
                  <span className="transaction-stepper__date">
                    {new Date(step.date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            {!isLast && (
              <div className={`transaction-stepper__connector ${stepStatus === "completed" ? "transaction-stepper__connector--active" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};
