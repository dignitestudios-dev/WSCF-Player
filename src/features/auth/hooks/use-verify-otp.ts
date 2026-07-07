"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/store";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/features/auth/api/auth.mutations";
import { verifyOtpSchema } from "@/features/auth/schemas/verify-otp.schema";
import { persistAuthSession } from "@/features/auth/utils/auth-session";
import { EMAIL_VERIFIED_ROUTE, SET_NEW_PASSWORD_ROUTE } from "@/config/routes";
import {
  showApiErrorToast,
  showApiSuccessToast,
} from "@/lib/api-toast";

const RESEND_COOLDOWN_SECONDS = 60;

export function useVerifyOtp() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const from = searchParams.get("from");
  const [otpDigits, setOtpDigits] = useState<string[]>(
    Array.from({ length: 6 }, () => "")
  );
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN_SECONDS);

  const { mutate: verify, isPending } = useVerifyOtpMutation();
  const { mutate: resend, isPending: isResending } = useResendOtpMutation();

  const form = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email, otp: "" },
  });

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timerId = window.setTimeout(() => {
      setResendTimer((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [resendTimer]);

  function startResendCooldown() {
    setResendTimer(RESEND_COOLDOWN_SECONDS);
  }

  function submitOtp(otp: string) {
    if (!email) return;

    verify(
      { email, otp },
      {
        onSuccess: (response) => {
          showApiSuccessToast(response, "OTP verified successfully");

          if (response.accessToken && response.user) {
            persistAuthSession({
              user: response.user,
              accessToken: response.accessToken,
              dispatch,
              setCookie: from !== "register",
            });
          }

          if (from === "register") {
            router.push(EMAIL_VERIFIED_ROUTE);
            return;
          }

          router.push(
            `${SET_NEW_PASSWORD_ROUTE}?email=${encodeURIComponent(email)}`
          );
        },
        onError: (error) => {
          showApiErrorToast(error, "OTP verification failed. Please try again.");
        },
      }
    );
  }

  function onSubmit(data: VerifyOtpFormData) {
    submitOtp(data.otp);
  }

  function handleOtpChange(digits: string[]) {
    setOtpDigits(digits);
    form.setValue("otp", digits.join(""), { shouldValidate: true });
  }

  function handleResend() {
    if (!email || resendTimer > 0 || isResending) return;

    resend(
      { email, type: "email" },
      {
        onSuccess: (response) => {
          showApiSuccessToast(response, "OTP resent successfully");
          setOtpDigits(Array.from({ length: 6 }, () => ""));
          form.setValue("otp", "");
          startResendCooldown();
        },
        onError: (error) => {
          showApiErrorToast(error, "Failed to resend OTP. Please try again.");
        },
      }
    );
  }

  function handleManualSubmit() {
    form.handleSubmit(onSubmit)();
  }

  const displayEmail = email || "your email";
  const canResend = resendTimer === 0 && !isResending;

  return {
    form,
    onSubmit,
    isPending,
    otpDigits,
    handleOtpChange,
    submitOtp,
    handleResend,
    handleManualSubmit,
    isResending,
    resendTimer,
    canResend,
    displayEmail,
    email,
  };
}
