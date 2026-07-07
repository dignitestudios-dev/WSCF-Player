"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LoginShell from "@/features/auth/components/login-shell";
import SetNewPasswordForm from "@/features/auth/components/set-new-password-form";
import { VERIFY_OTP_ROUTE } from "@/config/routes";

function SetNewPasswordContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const backHref = email
    ? `${VERIFY_OTP_ROUTE}?email=${encodeURIComponent(email)}`
    : VERIFY_OTP_ROUTE;

  return (
    <LoginShell
      contentMaxWidth="max-w-[343px]"
      showBack
      backHref={backHref}
      hideLogo
    >
      <SetNewPasswordForm />
    </LoginShell>
  );
}

export default function SetNewPasswordPageContent() {
  return (
    <Suspense fallback={null}>
      <SetNewPasswordContent />
    </Suspense>
  );
}
