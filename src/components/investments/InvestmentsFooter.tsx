import { useNavigate, useLocation } from "react-router-dom";
import { useInvestment } from "../../context/InvestmentContext";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "../../enrollment/enrollmentDraftStore";
import { EnrollmentFooter } from "../enrollment/EnrollmentFooter";

/**
 * InvestmentsFooter - Renders EnrollmentFooter for enrollment flow.
 * Primary action confirms allocation and navigates to Review.
 */
export const InvestmentsFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { canConfirmAllocation, confirmAllocation, getInvestmentSnapshot } = useInvestment();

  const isEnrollmentFlow = location.pathname === "/enrollment/investments";

  const handleContinue = () => {
    if (!canConfirmAllocation) return;
    confirmAllocation();
    const draft = loadEnrollmentDraft();
    if (draft) {
      saveEnrollmentDraft({
        ...draft,
        investment: getInvestmentSnapshot(),
      });
    }
    navigate("/enrollment/review");
  };

  if (!isEnrollmentFlow) return null;

  const summaryText = canConfirmAllocation
    ? "Allocation: 100% valid"
    : "Allocation must total 100%";

  return (
    <EnrollmentFooter
      step={3}
      primaryLabel="Continue to Review"
      primaryDisabled={!canConfirmAllocation}
      onPrimary={handleContinue}
      summaryText={summaryText}
      getDraftSnapshot={() => ({ investment: getInvestmentSnapshot() })}
    />
  );
};
