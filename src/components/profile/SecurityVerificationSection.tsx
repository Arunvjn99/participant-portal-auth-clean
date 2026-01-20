import { useState } from "react";
import Button from "../ui/Button";
import type { SecurityVerification } from "../../data/mockProfile";

interface SecurityVerificationSectionProps {
  data: SecurityVerification;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: SecurityVerification) => void;
  onCancel: () => void;
}

/**
 * SecurityVerificationSection - Security and verification section
 * MFA and recovery editable
 */
export const SecurityVerificationSection = ({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: SecurityVerificationSectionProps) => {
  const [formData, setFormData] = useState<SecurityVerification>(data);

  const handleSave = () => {
    const updatedData: SecurityVerification = {
      ...formData,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    onSave(updatedData);
  };

  const handleCancel = () => {
    setFormData(data);
    onCancel();
  };

  if (isEditing) {
    return (
      <div className="profile-section">
        <div className="profile-section__header">
          <h2 className="profile-section__title">Security & Verification</h2>
        </div>
        <div className="profile-section__content">
          <div className="profile-section__form">
            <div className="profile-section__field profile-section__field--read-only">
              <label className="profile-section__label">Identity Verification</label>
              <div className="profile-section__read-only-value">
                {data.identityVerified ? "Verified" : "Not Verified"}
              </div>
              {data.identityVerificationDate && (
                <p className="profile-section__helper-text">
                  Verified on: {new Date(data.identityVerificationDate).toLocaleDateString("en-US")}
                </p>
              )}
            </div>
            <div className="profile-section__field">
              <label className="profile-section__label">
                <input
                  type="checkbox"
                  checked={formData.mfaEnabled}
                  onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.checked })}
                  className="profile-section__checkbox"
                />
                Enable Multi-Factor Authentication (MFA)
              </label>
              {formData.mfaEnabled && (
                <div className="profile-section__field">
                  <label className="profile-section__label">MFA Method</label>
                  <select
                    className="profile-section__select"
                    name="mfaMethod"
                    value={formData.mfaMethod || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mfaMethod: e.target.value as SecurityVerification["mfaMethod"],
                      })
                    }
                  >
                    <option value="">Select method</option>
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                    <option value="authenticator-app">Authenticator App</option>
                  </select>
                </div>
              )}
            </div>
            <div className="profile-section__field profile-section__field--read-only">
              <label className="profile-section__label">Last Login</label>
              <div className="profile-section__read-only-value">
                {new Date(data.lastLogin).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div className="profile-section__field">
              <label className="profile-section__label">Recovery Email</label>
              <input
                type="email"
                className="profile-section__input"
                value={formData.recoveryEmail || ""}
                onChange={(e) => setFormData({ ...formData, recoveryEmail: e.target.value })}
                placeholder="Enter recovery email"
              />
            </div>
            <div className="profile-section__field">
              <label className="profile-section__label">Recovery Phone</label>
              <input
                type="tel"
                className="profile-section__input"
                value={formData.recoveryPhone || ""}
                onChange={(e) => setFormData({ ...formData, recoveryPhone: e.target.value })}
                placeholder="Enter recovery phone"
              />
            </div>
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
        <h2 className="profile-section__title">Security & Verification</h2>
        <Button onClick={onEdit} className="profile-section__edit-button">
          Edit
        </Button>
      </div>
      <div className="profile-section__content">
        <div className="profile-section__field-list">
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Identity Verification</span>
            <div className="profile-section__field-value-group">
              <span className="profile-section__field-value">
                {data.identityVerified ? "Verified" : "Not Verified"}
              </span>
              {data.identityVerified && (
                <span className="profile-section__verified-badge">Verified</span>
              )}
            </div>
            {data.identityVerificationDate && (
              <p className="profile-section__helper-text">
                Verified on: {new Date(data.identityVerificationDate).toLocaleDateString("en-US")}
              </p>
            )}
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Multi-Factor Authentication</span>
            <div className="profile-section__field-value-group">
              <span className="profile-section__field-value">
                {data.mfaEnabled ? "Enabled" : "Disabled"}
              </span>
              {data.mfaEnabled && data.mfaMethod && (
                <span className="profile-section__field-value">
                  ({data.mfaMethod.charAt(0).toUpperCase() + data.mfaMethod.slice(1).replace(/-/g, " ")})
                </span>
              )}
            </div>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Last Login</span>
            <span className="profile-section__field-value">
              {new Date(data.lastLogin).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
          {data.recoveryEmail && (
            <div className="profile-section__field-item">
              <span className="profile-section__field-label">Recovery Email</span>
              <span className="profile-section__field-value">{data.recoveryEmail}</span>
            </div>
          )}
          {data.recoveryPhone && (
            <div className="profile-section__field-item">
              <span className="profile-section__field-label">Recovery Phone</span>
              <span className="profile-section__field-value">{data.recoveryPhone}</span>
            </div>
          )}
        </div>
        {data.lastUpdated && (
          <p className="profile-section__timestamp">Last updated: {data.lastUpdated}</p>
        )}
      </div>
    </div>
  );
};
