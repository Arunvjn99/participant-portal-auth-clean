import Button from "../ui/Button";
import type { EmploymentClassification } from "../../data/mockProfile";

interface EmploymentClassificationSectionProps {
  data: EmploymentClassification;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: EmploymentClassification) => void;
  onCancel: () => void;
}

/**
 * EmploymentClassificationSection - Employment classification section
 * Fully read-only with explanation tooltip
 */
export const EmploymentClassificationSection = ({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: EmploymentClassificationSectionProps) => {
  // This section is read-only
  return (
    <div className="profile-section">
      <div className="profile-section__header">
        <h2 className="profile-section__title">Employment Classification</h2>
      </div>
      <div className="profile-section__content">
        <div className="profile-section__read-only-notice">
          <p className="profile-section__read-only-text">
            This information is determined by your employment status and cannot be changed. Contact HR if you
            believe there is an error.
          </p>
        </div>
        <div className="profile-section__field-list">
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Employee Type</span>
            <span className="profile-section__field-value">
              {data.employeeType.charAt(0).toUpperCase() + data.employeeType.slice(1).replace(/-/g, " ")}
            </span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Union Status</span>
            <span className="profile-section__field-value">
              {data.unionStatus.charAt(0).toUpperCase() + data.unionStatus.slice(1).replace(/-/g, " ")}
            </span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Compensation Type</span>
            <span className="profile-section__field-value">
              {data.compensationType.charAt(0).toUpperCase() + data.compensationType.slice(1)}
            </span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Eligibility Status</span>
            <span className="profile-section__field-value">
              {data.eligibilityStatus.charAt(0).toUpperCase() + data.eligibilityStatus.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
