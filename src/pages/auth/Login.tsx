import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Logo } from "../../components/brand/Logo";
import { Input } from "../../components/ui/Input";
import { PasswordInput } from "../../components/ui/PasswordInput";
import Button from "../../components/ui/Button";
import { branding } from "../../config/branding";

export const Login = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/verify");
  };

  const handleForgotPassword = () => {
    navigate("/forgot");
  };

  const handleHelpCenter = () => {
    navigate("/help");
  };

  const leftPanel = (
    <div className="login-left">
      <h2 className="login-left__title">Welcome back</h2>
      <p className="login-left__description">Sign in to access your retirement account.</p>
    </div>
  );

  return (
    <AuthLayout left={leftPanel}>
      <div className="login-right">
        <div className="login-right__brand">
          <Logo className="login-right__logo" />
          <span className="login-right__app-name">{branding.appName}</span>
        </div>
        <h1 className="login-right__title">Sign in</h1>
        <p className="login-right__helper">Enter your username and password to continue.</p>
        <div className="login-right__form">
          <Input
            label="Username"
            name="username"
            id="username"
            placeholder="Enter your username"
          />
          <PasswordInput
            label="Password"
            name="password"
            id="password"
            placeholder="Enter your password"
          />
          <div className="login-right__row">
            <label className="login-right__remember">
              <input className="login-right__checkbox" type="checkbox" name="rememberMe" />
              <span>Remember me</span>
            </label>
            <a
              href="#"
              className="login-right__forgot-link"
              onClick={(e) => {
                e.preventDefault();
                handleForgotPassword();
              }}
            >
              Forgot password?
            </a>
          </div>
          <Button onClick={handleContinue}>Continue</Button>
          <a
            href="#"
            className="login-right__forgot-link"
            onClick={(e) => {
              e.preventDefault();
              handleHelpCenter();
            }}
          >
            Need help signing in?
          </a>
        </div>
        <p className="login-right__footer">Privacy Policy · Terms</p>
      </div>
    </AuthLayout>
  );
};
