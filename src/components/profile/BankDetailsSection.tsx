import { useState } from "react";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import type { BankDetails } from "../../data/mockProfile";

interface BankDetailsSectionProps {
  data: BankDetails;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: BankDetails) => void;
  onCancel: () => void;
}

/**
 * BankDetailsSection - Bank and payment details section
 * Editable with verification, never shows full numbers
 */
export const BankDetailsSection = ({
  data,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: BankDetailsSectionProps) => {
  const [formData, setFormData] = useState<BankDetails>(data);

  const handleSave = () => {
    const updatedData: BankDetails = {
      ...formData,
      accountNumber: `****${formData.accountNumber.slice(-4)}`, // Ensure masking
      routingNumber: `****${formData.routingNumber.slice(-4)}`, // Ensure masking
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    onSave(updatedData);
    // TODO: Trigger verification flow
  };

  const handleCancel = () => {
    setFormData(data);
    onCancel();
  };

  if (isEditing) {
    return (
      <div className="profile-section">
        <div className="profile-section__header">
          <h2 className="profile-section__title">Bank & Payment Details</h2>
        </div>
        <div className="profile-section__content">
          <div className="profile-section__form">
            <Input
              label="Bank Name"
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              required
            />
            <div className="profile-section__field">
              <label className="profile-section__label">Account Type</label>
              <select
                className="profile-section__select"
                name="accountType"
                value={formData.accountType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    accountType: e.target.value as BankDetails["accountType"],
                  })
                }
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>
            <div className="profile-section__field">
              <Input
                label="Account Number"
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                required
              />
              <p className="profile-section__helper-text">
                Enter full account number. It will be masked after saving.
              </p>
            </div>
            <div className="profile-section__field">
              <Input
                label="Routing Number"
                type="text"
                name="routingNumber"
                value={formData.routingNumber}
                onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                required
              />
              <p className="profile-section__helper-text">
                Enter full routing number. It will be masked after saving.
              </p>
            </div>
            <Input
              label="Account Holder Name"
              type="text"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
              required
            />
            <p className="profile-section__helper-text profile-section__helper-text--warning">
              You will need to verify your bank account after saving
            </p>
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
        <h2 className="profile-section__title">Bank & Payment Details</h2>
        <Button onClick={onEdit} className="profile-section__edit-button">
          Edit
        </Button>
      </div>
      <div className="profile-section__content">
        <div className="profile-section__field-list">
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Bank Name</span>
            <span className="profile-section__field-value">{data.bankName}</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Account Type</span>
            <span className="profile-section__field-value">
              {data.accountType.charAt(0).toUpperCase() + data.accountType.slice(1)}
            </span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Account Number</span>
            <span className="profile-section__field-value">{data.accountNumber}</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Routing Number</span>
            <span className="profile-section__field-value">{data.routingNumber}</span>
          </div>
          <div className="profile-section__field-item">
            <span className="profile-section__field-label">Account Holder Name</span>
            <span className="profile-section__field-value">{data.accountHolderName}</span>
          </div>
        </div>
        {data.lastUpdated && (
          <p className="profile-section__timestamp">Last updated: {data.lastUpdated}</p>
        )}
      </div>
    </div>
  );
};
