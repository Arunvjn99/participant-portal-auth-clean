import Button from "../ui/Button";
import type { EmploymentInformation } from "../../data/mockProfile";

interface EmploymentInformationSectionProps {
  data: EmploymentInformation;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: EmploymentInformation) => void;
  onCancel: () => void;
}

/**
 * EmploymentInformationSection - Employment information section
 * Fully read-only with HR tooltip
 */
export const EmploymentInformationSection = ({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: EmploymentInformationSectionProps) => {
  // This section is read-only, so editing is disabled
  return (
    <div className="profile-section">
      <div className="profile-section__header">
        <h2 className="profile-section__title">Employment Information</h2>
      </div>
      <div className="profile-section__content">
        <div className="profile-section__read-only-notice">
          <p className="profile-section__read-only-text">
            This information is managed by your HR department and cannot be edited here. Please contact HR for
            any changes.
          </p>
        </div>
        <div className="profile-section__field-list">
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Employer Name</span>
            <span className="profile-section__field-value">{data.employerName}</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Employee ID</span>
            <span className="profile-section__field-value">{data.employeeId}</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Hire Date</span>
            <span className="profile-section__field-value">
              {new Date(data.hireDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Employment Status</span>
            <span className="profile-section__field-value">
              {data.employmentStatus.charAt(0).toUpperCase() +
                data.employmentStatus.slice(1).replace(/-/g, " ")}
            </span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Work Location</span>
            <span className="profile-section__field-value">{data.workLocation}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
