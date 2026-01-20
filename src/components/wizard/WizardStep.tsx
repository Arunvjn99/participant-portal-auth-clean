import type { ReactNode } from "react";

interface WizardStepProps {
  children: ReactNode;
}

export const WizardStep = ({ children }: WizardStepProps) => {
  return <div className="wizard-step">{children}</div>;
};
