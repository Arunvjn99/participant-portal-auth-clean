import type { ReactNode } from "react";

export interface WizardStep {
  id: string;
  title: string;
  content: ReactNode;
}

interface WizardProps {
  steps: WizardStep[];
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  header?: ReactNode;
  footer?: ReactNode;
}

export const Wizard = ({ steps, currentStep, onNext, onBack, header, footer }: WizardProps) => {
  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="wizard">
      {header}
      <div className="wizard__content">
        {currentStepData?.content}
      </div>
      {footer || (
        <div className="wizard__footer">
          <button
            type="button"
            onClick={onBack}
            disabled={isFirstStep}
            className="wizard__button wizard__button--back"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="wizard__button wizard__button--next"
          >
            {isLastStep ? "Proceed" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
};
