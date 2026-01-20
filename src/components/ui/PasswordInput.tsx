import { useState } from "react";
import { Input } from "./Input";
import type { InputProps } from "./Input";

interface PasswordInputProps extends Omit<InputProps, "type"> {}

export const PasswordInput = (props: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div className="password-input-wrapper">
      <Input type={isVisible ? "text" : "password"} {...props} />
      <button
        type="button"
        onClick={toggleVisibility}
        className="password-input-toggle"
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
      >
        {isVisible ? "Hide" : "Show"}
      </button>
    </div>
  );
};
