"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForgotPasswordMutation,
  useResendVerificationLinkMutation,
} from "@/features/auth/api/auth.mutations";
import { forgotPasswordSchema } from "@/features/auth/schemas/forgot-password.schema";
import { showApiErrorToast, showApiSuccessToast } from "@/lib/api-toast";

// What the API says when the account's email was never verified. Recognised by
// its wording because that is all the error carries.
const UNVERIFIED_PATTERN = /verify your email first/i;

export function useForgotPassword() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const {
    mutate: sendResetLink,
    isPending,
    error,
    reset: resetRequest,
  } = useForgotPasswordMutation();
  const { mutate: resendVerification, isPending: isSendingVerification } =
    useResendVerificationLinkMutation();

  const [sentTo, setSentTo] = useState<string | null>(null);
  const [verificationSentTo, setVerificationSentTo] = useState<string | null>(
    null
  );
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: initialEmail },
  });

  function onSubmit(data: ForgotPasswordFormData) {
    setVerificationSentTo(null);
    setSubmittedEmail(data.email);
    sendResetLink(data, {
      // No OTP screen any more: the link in the email does the rest.
      onSuccess: () => setSentTo(data.email),
    });
  }

  const needsVerification = Boolean(
    error?.message && UNVERIFIED_PATTERN.test(error.message)
  );

  function sendVerificationLink() {
    if (!submittedEmail) return;
    resendVerification(
      { email: submittedEmail },
      {
        onSuccess: (response) => {
          showApiSuccessToast(response, "Verification link sent");
          setVerificationSentTo(submittedEmail);
        },
        onError: (err) => {
          showApiErrorToast(err, "Could not send the verification link.");
        },
      }
    );
  }

  function tryAnotherEmail() {
    setSentTo(null);
    setVerificationSentTo(null);
    resetRequest();
  }

  return {
    form,
    onSubmit,
    isPending,
    error: error?.message ?? null,
    sentTo,
    needsVerification,
    sendVerificationLink,
    isSendingVerification,
    verificationSentTo,
    tryAnotherEmail,
  };
}
