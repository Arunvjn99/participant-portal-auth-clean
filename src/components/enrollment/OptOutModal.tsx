import { Modal } from "../ui/Modal";
import Button from "../ui/Button";

interface OptOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planName: string;
}

/**
 * OptOutModal - Warning modal for opting out of a plan
 * Explains consequences and requires confirmation
 */
export const OptOutModal = ({ isOpen, onClose, onConfirm, planName }: OptOutModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <div className="opt-out-modal">
        <div className="opt-out-modal__header">
          <h2 className="opt-out-modal__title">Opt Out of {planName}</h2>
        </div>

        <div className="opt-out-modal__content">
          <div className="opt-out-modal__warning">
            <p className="opt-out-modal__warning-text">
              <strong>Warning:</strong> Opting out of this plan will have the following consequences:
            </p>
            <ul className="opt-out-modal__consequences">
              <li>Your contributions will stop immediately</li>
              <li>You will no longer receive employer matching contributions</li>
              <li>Your existing balance will remain in the plan but will not grow through new contributions</li>
              <li>You may be subject to early withdrawal penalties if you take distributions before retirement age</li>
              <li>You may lose access to certain plan features and benefits</li>
            </ul>
            <p className="opt-out-modal__warning-text">
              This action can be reversed, but you may need to wait for the next enrollment period to re-enroll.
            </p>
          </div>

          <div className="opt-out-modal__confirmation">
            <label className="opt-out-modal__checkbox-label">
              <input
                type="checkbox"
                id="opt-out-confirm"
                className="opt-out-modal__checkbox"
                required
              />
              <span>
                I understand the consequences and wish to opt out of the {planName} plan.
              </span>
            </label>
          </div>
        </div>

        <div className="opt-out-modal__footer">
          <Button
            onClick={onClose}
            className="opt-out-modal__button opt-out-modal__button--cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              const checkbox = document.getElementById("opt-out-confirm") as HTMLInputElement;
              if (checkbox?.checked) {
                onConfirm();
              }
            }}
            className="opt-out-modal__button opt-out-modal__button--confirm"
          >
            Confirm Opt-Out
          </Button>
        </div>
      </div>
    </Modal>
  );
};
