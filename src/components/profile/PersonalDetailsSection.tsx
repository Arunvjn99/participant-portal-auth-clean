import { useState } from "react";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import type { PersonalDetails } from "../../data/mockProfile";

interface PersonalDetailsSectionProps {
  data: PersonalDetails;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: PersonalDetails) => void;
  onCancel: () => void;
}

/**
 * PersonalDetailsSection - Personal information section
 * Editable with confirmation (except DOB)
 */
export const PersonalDetailsSection = ({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: PersonalDetailsSectionProps) => {
  const [formData, setFormData] = useState<PersonalDetails>(data);

  // Calculate age from date of birth
  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(data.dateOfBirth);

  const handleSave = () => {
    const updatedData: PersonalDetails = {
      ...formData,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    onSave(updatedData);
  };

  const handleCancel = () => {
    setFormData(data); // Reset to original data
    onCancel();
  };

  if (isEditing) {
    return (
      <div className="profile-section">
        <div className="profile-section__header">
          <h2 className="profile-section__title">Personal Details</h2>
        </div>
        <div className="profile-section__content">
          <div className="profile-section__form">
            <Input
              label="First Name"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              label="Middle Name"
              type="text"
              name="middleName"
              value={formData.middleName || ""}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
            />
            <Input
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
            <div className="profile-section__field">
              <Input
                label="Legal Name"
                type="text"
                name="legalName"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                required
              />
              <p className="profile-section__helper-text">Name as it appears on legal documents</p>
            </div>
            <div className="profile-section__field">
              <label className="profile-section__label">Gender</label>
              <select
                className="profile-section__select"
                name="gender"
                value={formData.gender || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value as PersonalDetails["gender"] | undefined,
                  })
                }
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            <div className="profile-section__field profile-section__field--read-only">
              <label className="profile-section__label">Date of Birth</label>
              <div className="profile-section__read-only-value">
                {new Date(data.dateOfBirth).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <p className="profile-section__helper-text">Date of birth cannot be changed</p>
            </div>
            <div className="profile-section__field profile-section__field--read-only">
              <label className="profile-section__label">Age</label>
              <div className="profile-section__read-only-value">{age} years</div>
            </div>
            <div className="profile-section__field">
              <label className="profile-section__label">Marital Status</label>
              <select
                className="profile-section__select"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maritalStatus: e.target.value as PersonalDetails["maritalStatus"],
                  })
                }
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
                <option value="domestic-partnership">Domestic Partnership</option>
              </select>
            </div>
            <Input
              label="Citizenship"
              type="text"
              name="citizenship"
              value={formData.citizenship}
              onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
              required
            />
            <Input
              label="Residency"
              type="text"
              name="residency"
              value={formData.residency}
              onChange={(e) => setFormData({ ...formData, residency: e.target.value })}
              required
            />
          </div>
          <div className="profile-section__actions">
            <Button onClick={handleCancel} className="profile-section__button profile-section__button--cancel">
              Cancel
            </Button>
            <Button onClick={handleSave} className="profile-section__button profile-section__button--save">
              Save Changes
            </Button>
          </div>
          {data.lastUpdated && (
            <p className="profile-section__timestamp">Last updated: {data.lastUpdated}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-section">
      <div className="profile-section__header">
        <h2 className="profile-section__title">Personal Details</h2>
        <Button onClick={onEdit} className="profile-section__edit-button">
          Edit
        </Button>
      </div>
      <div className="profile-section__content">
        <div className="profile-section__field-list">
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">First Name</span>
            <span className="profile-section__field-value">{data.firstName}</span>
          </div>
          {data.middleName && (
            <div className="profile-section__field-item">
              <span className="profile-section__field-label">Middle Name</span>
              <span className="profile-section__field-value">{data.middleName}</span>
            </div>
          )}
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Last Name</span>
            <span className="profile-section__field-value">{data.lastName}</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Legal Name</span>
            <span className="profile-section__field-value">{data.legalName}</span>
          </div>
          {data.gender && (
            <div className="profile-section__field-item">
              <span className="profile-section__field-label">Gender</span>
              <span className="profile-section__field-value">
                {data.gender.charAt(0).toUpperCase() + data.gender.slice(1).replace(/-/g, " ")}
              </span>
            </div>
          )}
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Date of Birth</span>
            <span className="profile-section__field-value">
              {new Date(data.dateOfBirth).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Age</span>
            <span className="profile-section__field-value">{age} years</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Marital Status</span>
            <span className="profile-section__field-value">
              {data.maritalStatus.charAt(0).toUpperCase() + data.maritalStatus.slice(1).replace(/-/g, " ")}
            </span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Citizenship</span>
            <span className="profile-section__field-value">{data.citizenship}</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Residency</span>
            <span className="profile-section__field-value">{data.residency}</span>
          </div>
        </div>
        {data.lastUpdated && (
          <p className="profile-section__timestamp">Last updated: {data.lastUpdated}</p>
        )}
      </div>
    </div>
  );
};
