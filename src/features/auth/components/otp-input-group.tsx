"use client";

interface OtpInputGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  onComplete?: (otp: string) => void;
  /**
   * Locks every box. Set while a code is being checked, and left set once one
   * is accepted — a verified code is spent, so there is nothing a further
   * digit could do except start a second submission.
   */
  disabled?: boolean;
}

export default function OtpInputGroup({
  value,
  onChange,
  onComplete,
  disabled = false,
}: OtpInputGroupProps) {
  function handleChange(index: number, digit: string) {
    if (disabled) return;
    if (digit && !/^\d$/.test(digit)) return;

    const next = [...value];
    next[index] = digit;
    onChange(next);

    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    const otp = next.join("");
    if (otp.length === 6 && next.every((d) => d !== "")) {
      onComplete?.(otp);
    }
  }

  function handleKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (disabled) return;
    if (event.key === "Backspace" && !value[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    if (disabled) return;
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const next = Array.from({ length: 6 }, (_, i) => pasted[i] ?? "");
    onChange(next);

    const focusIndex = Math.min(pasted.length, 5);
    document.getElementById(`otp-${focusIndex}`)?.focus();

    if (pasted.length === 6) {
      onComplete?.(pasted);
    }
  }

  return (
    <div className="flex w-full justify-between gap-[10px]">
      {value.map((digit, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value.slice(-1))}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="h-[49px] w-[48px] rounded-[24px] border border-[#3D3775] bg-white text-center text-base font-medium text-[#181818] outline-none focus:ring-2 focus:ring-[#083F92]/15 disabled:cursor-not-allowed disabled:border-[#C4C4C4] disabled:bg-[#F4F4F4] disabled:text-[#8A8A8A]"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
