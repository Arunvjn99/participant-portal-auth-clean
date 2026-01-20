import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../ui/Modal";
import { Wizard, type WizardStep } from "../wizard/Wizard";
import { WizardHeader } from "../wizard/WizardHeader";
import { WizardFooter } from "../wizard/WizardFooter";
import { WizardStep as WizardStepWrapper } from "../wizard/WizardStep";
import { AgeStep } from "./steps/AgeStep";
import { FinancialStep } from "./steps/FinancialStep";
import { LocationStep } from "./steps/LocationStep";

interface EnrollmentWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnrollmentWizard = ({ isOpen, onClose }: EnrollmentWizardProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [enrollmentData, setEnrollmentData] = useState({
    age: undefined as number | undefined,
    retirementAge: undefined as number | undefined,
    salary: undefined as number | undefined,
    currentSavings: undefined as number | undefined,
    location: undefined as string | undefined,
  });

  const totalSteps = 3;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const steps: WizardStep[] = [
    {
      id: "age",
      title: "Age & Retirement Planning",
      content: (
        <WizardStepWrapper>
          <AgeStep
            age={enrollmentData.age}
            retirementAge={enrollmentData.retirementAge}
            onAgeChange={(age) => setEnrollmentData((prev) => ({ ...prev, age }))}
            onRetirementAgeChange={(retirementAge) =>
              setEnrollmentData((prev) => ({ ...prev, retirementAge }))
            }
          />
        </WizardStepWrapper>
      ),
    },
    {
      id: "financial",
      title: "Financial Information",
      content: (
        <WizardStepWrapper>
          <FinancialStep
            salary={enrollmentData.salary}
            currentSavings={enrollmentData.currentSavings}
            onSalaryChange={(salary) => setEnrollmentData((prev) => ({ ...prev, salary }))}
            onCurrentSavingsChange={(currentSavings) =>
              setEnrollmentData((prev) => ({ ...prev, currentSavings }))
            }
          />
        </WizardStepWrapper>
      ),
    },
    {
      id: "location",
      title: "Location Selection",
      content: (
        <WizardStepWrapper>
          <LocationStep
            location={enrollmentData.location}
            onLocationChange={(location) => setEnrollmentData((prev) => ({ ...prev, location }))}
          />
        </WizardStepWrapper>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onClose();
    navigate("/enrollment/choose-plan");
  };

  const handleSaveAndExit = () => {
    // TODO: Save enrollment data
    onClose();
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="enrollment-wizard">
        <WizardHeader
          title="Enrollment Wizard"
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
          onClose={onClose}
          onSaveAndExit={handleSaveAndExit}
        />
        <Wizard
          steps={steps}
          currentStep={currentStep}
          onNext={handleNext}
          onBack={handleBack}
          header={null}
          footer={
            <WizardFooter
              onBack={handleBack}
              onNext={handleNext}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
            />
          }
        />
      </div>
    </Modal>
  );
};
