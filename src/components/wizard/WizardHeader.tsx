
interface WizardHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  progress: number;
  onClose: () => void;
  onSaveAndExit?: () => void;
}

export const WizardHeader = ({
  title,
  currentStep,
  totalSteps,
  progress,
  onClose,
  onSaveAndExit,
}: WizardHeaderProps) => {
  return (
    <header className="wizard-header">
      <div className="wizard-header__top">
        <h2 className="wizard-header__title">{title}</h2>
        <div className="wizard-header__actions">
          {onSaveAndExit && (
            <button
              type="button"
              onClick={onSaveAndExit}
              className="wizard-header__link"
            >
              Save & Exit
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="wizard-header__close"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>
      <div className="wizard-header__progress">
        <span className="wizard-header__step-indicator">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <div className="wizard-header__progress-bar">
          <div
            className="wizard-header__progress-fill"
            style={{ "--progress": `${progress}%` } as React.CSSProperties}
          />
        </div>
      </div>
    </header>
  );
};
