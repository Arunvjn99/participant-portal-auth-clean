import { useNavigate } from "react-router-dom";
import { EnrollmentStepper } from "../../components/enrollment/EnrollmentStepper";
import { StrategySelector } from "../../components/investments/StrategySelector";
import { PlanDefaultBuilder } from "../../components/investments/PlanDefaultBuilder";
import { ManualBuilder } from "../../components/investments/ManualBuilder";
import { AdvisorView } from "../../components/investments/AdvisorView";
import { useInvestment } from "../../context/InvestmentContext";

/**
 * InvestmentsPage - Main content component (must be inside InvestmentProvider)
 */
export default function InvestmentsPage() {
  const navigate = useNavigate();
  const { selectedStrategy, setSelectedStrategy } = useInvestment();

  const handleBack = () => {
    navigate("/enrollment/contribution");
  };

  return (
    <div className="investments-page">
      {/* Enrollment Stepper */}
      <div className="investments-page__stepper">
        <EnrollmentStepper currentStep={2} />
      </div>

      <div className="investments-page__header">
        <button
          type="button"
          onClick={handleBack}
          className="investments-page__back-button"
          aria-label="Back to contribution"
        >
          <span className="investments-page__back-icon" aria-hidden="true">←</span>
          <span className="investments-page__back-text">Back</span>
        </button>
        <h1 className="investments-page__title">Investment Portfolio</h1>
        <p className="investments-page__description">
          Choose how you want to manage your investment allocation.
        </p>
      </div>

      <div className="investments-page__strategy">
        <StrategySelector
          selectedStrategy={selectedStrategy}
          onStrategyChange={setSelectedStrategy}
        />
      </div>

      <div className="investments-page__builder">
        {selectedStrategy === "planDefault" && <PlanDefaultBuilder />}
        {selectedStrategy === "manual" && <ManualBuilder />}
        {selectedStrategy === "advisor" && <AdvisorView />}
      </div>
    </div>
  );
}
