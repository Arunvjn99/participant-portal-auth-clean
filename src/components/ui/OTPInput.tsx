import { useRef, useEffect } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";

interface OTPInputProps {
  onComplete?: (value: string) => void;
  className?: string;
}

export const OTPInput = ({ onComplete, className }: OTPInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const values = useRef<string[]>(Array(6).fill(""));

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleInput = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      e.target.value = values.current[index];
      return;
    }

    // Update value
    values.current[index] = value;

    // Move to next field if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all fields are filled
    const otpValue = values.current.join("");
    if (otpValue.length === 6 && onComplete) {
      onComplete(otpValue);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const digits = pastedData.match(/\d/g) || [];

    digits.forEach((digit, i) => {
      if (i < 6) {
        values.current[i] = digit;
        if (inputRefs.current[i]) {
          inputRefs.current[i]!.value = digit;
        }
      }
    });

    // Focus the next empty field or the last field
    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();

    // Check if all fields are filled
    const otpValue = values.current.join("");
    if (otpValue.length === 6 && onComplete) {
      onComplete(otpValue);
    }
  };

  return (
    <div 
      className={`otp-input ${className || ""}`}
      role="group"
      aria-label="6-digit verification code"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="otp-input__field"
          onChange={(e) => handleInput(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          aria-label={`Digit ${index + 1} of 6`}
        />
      ))}
    </div>
  );
};
