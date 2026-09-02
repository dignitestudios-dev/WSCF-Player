"use client";

import OtpInputGroup from "@/features/auth/components/otp-input-group";
import { VerifyOtpIcon } from "@/features/auth/components/verify-otp-icons";
import { useVerifyOtp } from "@/features/auth/hooks/use-verify-otp";

export default function VerifyOtpForm() {
  const {
    form,
    isPending,
    isVerified,
    isLocked,
    otpDigits,
    handleOtpChange,
    submitOtp,
    handleResend,
    handleManualSubmit,
    isResending,
    resendTimer,
    canResend,
    displayEmail,
  } = useVerifyOtp();

  const otpError = form.formState.errors.otp?.message;

  return (
    <div className="flex w-full flex-col items-center gap-[26px]">
      <div className="flex h-[146px] w-[146px] items-center justify-center rounded-full bg-[rgba(8,63,146,0.1)]">
        <VerifyOtpIcon />
      </div>

      <div className="flex w-full flex-col gap-[33px]">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-[32px] font-semibold capitalize leading-[43px] tracking-[-0.008em] text-[#083F92]">
            Verify OTP
          </h1>
          <p className="text-base leading-[22px] tracking-[-0.014em] text-[#565656]">
            The code was sent to {displayEmail}
          </p>
        </div>

        <div className="flex flex-col gap-[26px]">
          <OtpInputGroup
            value={otpDigits}
            onChange={handleOtpChange}
            onComplete={submitOtp}
            disabled={isLocked}
          />

          {otpError && (
            <p className="text-center text-sm text-red-600">{otpError}</p>
          )}

          <button
            type="button"
            onClick={handleManualSubmit}
            disabled={isLocked || otpDigits.join("").length !== 6}
            className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-60"
          >
            {isPending ? "Verifying..." : isVerified ? "Verified" : "Submit"}
          </button>

          <p className="text-center text-base leading-[22px] tracking-[0.01em] text-[#565656]">
            Didn&apos;t receive the code yet?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isLocked || isResending}
              className="font-medium text-[#083F92] hover:underline disabled:cursor-not-allowed disabled:text-[#565656] disabled:no-underline"
            >
              {isResending
                ? "Sending..."
                : resendTimer > 0
                  ? `Resend in ${resendTimer}s`
                  : "Resend"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
