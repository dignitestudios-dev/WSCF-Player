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
  // Stays true once a code is accepted. The redirect that follows is not
  // instant, and until it happens the boxes would otherwise still take input —
  // a second submission against a code the server has already spent.
  const [isVerified, setIsVerified] = useState(false);

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
    // Typing the sixth digit submits, and the Submit button submits. Without
    // this guard, doing both sends the same code twice and the second attempt
    // fails against a code the first one just consumed.
    if (isPending || isVerified) return;

    verify(
      { email, otp },
      {
        onSuccess: (response) => {
          setIsVerified(true);
          showApiSuccessToast(response, "OTP verified successfully");

          if (response.accessToken && response.user) {
            persistAuthSession({
              user: response.user,
              accessToken: response.accessToken,
              dispatch,
              // Signing up authenticates you: the rest of onboarding — paying,
              // linking records, picking a player — runs behind the route
              // guard, which reads the cookie. Without it the first protected
              // step bounces to the login page, which reads as being logged
              // out mid-signup.
              //
              // Resetting a password is the exception. That token is carried in
              // the URL to the reset screen, and a cookie would bounce the user
              // to the dashboard before they had set the new password.
              setCookie: from !== "forgot-password",
            });
          }

          if (from === "register") {
            router.push(EMAIL_VERIFIED_ROUTE);
            return;
          }

          if (from === "forgot-password") {
            router.push(
              `${SET_NEW_PASSWORD_ROUTE}?email=${encodeURIComponent(email)}&token=${encodeURIComponent(response.accessToken ?? "")}`
            );
            return;
          }

          router.push(
            `${SET_NEW_PASSWORD_ROUTE}?email=${encodeURIComponent(email)}`
          );
        },
        onError: (error) => {
          // Left unlocked deliberately: a rejected code is the one case where
          // the user needs the boxes back to correct it.
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
      {
        email,
        type: "email",
        // The same screen serves both journeys; the mail should read like the
        // one the user is actually in the middle of.
        purpose: from === "forgot-password" ? "reset" : "verify",
      },
      {
        onSuccess: (response) => {
          showApiSuccessToast(response, "OTP resent successfully");
          setOtpDigits(Array.from({ length: 6 }, () => ""));
          form.setValue("otp", "");
          setIsVerified(false);
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
  const canResend = resendTimer === 0 && !isResending && !isVerified;
  // One flag for everything the form must stop accepting: the boxes, Submit
  // and Resend all read this.
  const isLocked = isPending || isVerified;

  return {
    form,
    onSubmit,
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
    email,
  };
}
