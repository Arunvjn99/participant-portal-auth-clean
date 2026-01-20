import Button from "../ui/Button";

interface WizardFooterProps {
  onBack: () => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  backLabel?: string;
  nextLabel?: string;
}

export const WizardFooter = ({
  onBack,
  onNext,
  isFirstStep,
  isLastStep,
  backLabel = "Back",
  nextLabel = "Next",
}: WizardFooterProps) => {
  return (
    <footer className="wizard-footer">
      <Button
        onClick={onBack}
        disabled={isFirstStep}
        className="wizard-footer__button wizard-footer__button--back"
      >
        {backLabel}
      </Button>
      <Button
        onClick={onNext}
        className="wizard-footer__button wizard-footer__button--next"
      >
        {isLastStep ? "Proceed" : nextLabel}
      </Button>
    </footer>
  );
};
