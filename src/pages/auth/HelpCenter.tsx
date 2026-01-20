import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Logo } from "../../components/brand/Logo";
import { branding } from "../../config/branding";

export const HelpCenter = () => {
  const navigate = useNavigate();

  const handleBackToSignIn = () => {
    navigate("/");
  };

  const leftPanel = (
    <div className="login-left">
      <h2 className="login-left__title">Need help?</h2>
      <p className="login-left__description">Our support team is here to assist you.</p>
    </div>
  );

  return (
    <AuthLayout left={leftPanel}>
      <div className="login-right">
        <div className="login-right__brand">
          <Logo className="login-right__logo" />
          <span className="login-right__app-name">{branding.appName}</span>
        </div>
        <h1 className="login-right__title">Help Center</h1>
        <p className="login-right__helper">If you're having trouble signing in, contact us:</p>
        <div className="login-right__form">
          <div className="help-center__support-list">
            <div className="help-center__support-item">
              <div className="help-center__support-label">Phone support</div>
              <a href="tel:1-800-555-0199" className="help-center__support-value">
                1-800-555-0199
              </a>
            </div>
            <div className="help-center__support-item">
              <div className="help-center__support-label">Email</div>
              <a href="mailto:support@example.com" className="help-center__support-value">
                support@example.com
              </a>
            </div>
          </div>
          <a
            href="#"
            className="login-right__forgot-link"
            onClick={(e) => {
              e.preventDefault();
              handleBackToSignIn();
            }}
          >
            Back to sign in
          </a>
        </div>
      </div>
    </AuthLayout>
  );
};
