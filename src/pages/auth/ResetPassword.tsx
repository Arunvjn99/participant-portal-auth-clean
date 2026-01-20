import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Logo } from "../../components/brand/Logo";
import { PasswordInput } from "../../components/ui/PasswordInput";
import Button from "../../components/ui/Button";
import { branding } from "../../config/branding";

export const ResetPassword = () => {
  const navigate = useNavigate();

  const handleResetPassword = () => {
    navigate("/");
  };

  const handleBackToSignIn = () => {
    navigate("/");
  };

  const leftPanel = (
    <div className="login-left">
      <h2 className="login-left__title">Create a new password</h2>
      <p className="login-left__description">Choose a strong password to secure your account.</p>
    </div>
  );

  return (
    <AuthLayout left={leftPanel}>
      <div className="login-right">
        <div className="login-right__brand">
          <Logo className="login-right__logo" />
          <span className="login-right__app-name">{branding.appName}</span>
        </div>
        <h1 className="login-right__title">Reset your password</h1>
        <p className="login-right__helper">
          Your password must be at least 8 characters long and include a mix of letters, numbers, and
          special characters.
        </p>
        <div className="login-right__form">
          <PasswordInput
            label="New password"
            name="newPassword"
            id="newPassword"
            placeholder="Enter your new password"
          />
          <PasswordInput
            label="Confirm password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm your new password"
          />
          <Button onClick={handleResetPassword}>Reset password</Button>
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
