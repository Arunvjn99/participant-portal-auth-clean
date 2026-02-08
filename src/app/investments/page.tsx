import { ManualBuilder } from "../../components/investments/ManualBuilder";

/**
 * InvestmentsPage - Main content (ManualBuilder). Stepper + grid layout in InvestmentsLayout.
 */
export default function InvestmentsPage() {
  return (
    <div className="investments-page__builder">
      <ManualBuilder />
    </div>
  );
}
