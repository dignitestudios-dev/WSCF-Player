"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LoginShell from "@/features/auth/components/login-shell";
import VerifyOtpForm from "@/features/auth/components/verify-otp-form";
import { BECOME_MEMBER_ROUTE, FORGOT_PASSWORD_ROUTE } from "@/config/routes";

function VerifyOtpPageContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const backHref = from === "register" ? BECOME_MEMBER_ROUTE : FORGOT_PASSWORD_ROUTE;

  return (
    <LoginShell
      contentMaxWidth="max-w-[343px]"
      showBack
      backHref={backHref}
      hideLogo
    >
      <VerifyOtpForm />
    </LoginShell>
  );
}

export default function VerifyOtpShell() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpPageContent />
    </Suspense>
  );
}
