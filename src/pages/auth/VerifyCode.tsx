import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Logo } from "../../components/brand/Logo";
import { OTPInput } from "../../components/ui/OTPInput";
import Button from "../../components/ui/Button";
import { branding } from "../../config/branding";

export const VerifyCode = () => {
  const navigate = useNavigate();

  const handleOTPComplete = () => {
    navigate("/dashboard");
  };

  const handleVerify = () => {
    navigate("/dashboard");
  };

  const handleBackToSignIn = () => {
    navigate("/");
  };

  const leftPanel = (
    <div className="login-left">
      <h2 className="login-left__title">Verify your identity</h2>
      <p className="login-left__description">Enter the 6-digit code sent to your email.</p>
    </div>
  );

  return (
    <AuthLayout left={leftPanel}>
      <div className="login-right">
        <div className="login-right__brand">
          <Logo className="login-right__logo" />
          <span className="login-right__app-name">{branding.appName}</span>
        </div>
        <h1 className="login-right__title">Verification code</h1>
        <p className="login-right__helper">We've sent a 6-digit code to your email address.</p>
        <div className="login-right__form">
          <div className="verify-code__otp-wrapper">
            <OTPInput onComplete={handleOTPComplete} />
          </div>
          <Button onClick={handleVerify}>Verify & continue</Button>
          <div className="verify-code__links">
            <a
              href="#"
              className="login-right__forgot-link"
              onClick={(e) => {
                e.preventDefault();
              }}
              aria-label="Resend verification code"
            >
              Resend code
            </a>
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
      </div>
    </AuthLayout>
  );
};
