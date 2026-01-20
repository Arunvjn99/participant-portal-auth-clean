import { useId } from "react";
import type { InputHTMLAttributes, ChangeEvent } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  error?: string;
}

export const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  id,
  error,
  ...props
}: InputProps) => {
  const generatedId = useId();
  const inputId = id || name || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="input-wrapper">
      <label htmlFor={inputId} className="input-label">
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input ${error ? "input--error" : ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        {...props}
      />
      {error && (
        <span id={errorId} className="input-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
