import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

const Button = ({ children, type = "button", disabled, className, onClick, ...props }: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
      className={`button ${className || ""}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
