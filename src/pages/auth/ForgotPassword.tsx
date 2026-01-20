import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Logo } from "../../components/brand/Logo";
import { Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { branding } from "../../config/branding";

export const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSendResetLink = () => {
    navigate("/reset");
  };

  const handleBackToSignIn = () => {
    navigate("/");
  };

  const leftPanel = (
    <div className="login-left">
      <h2 className="login-left__title">Account recovery</h2>
      <p className="login-left__description">We'll help you reset your password securely.</p>
    </div>
  );

  return (
    <AuthLayout left={leftPanel}>
      <div className="login-right">
        <div className="login-right__brand">
          <Logo className="login-right__logo" />
          <span className="login-right__app-name">{branding.appName}</span>
        </div>
        <h1 className="login-right__title">Forgot your password?</h1>
        <p className="login-right__helper">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <div className="login-right__form">
          <Input
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email address"
          />
          <Button onClick={handleSendResetLink}>Send reset link</Button>
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
