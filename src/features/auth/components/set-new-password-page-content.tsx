"use client";

import { Suspense } from "react";
import LoginShell from "@/features/auth/components/login-shell";
import SetNewPasswordForm from "@/features/auth/components/set-new-password-form";
import { FORGOT_PASSWORD_ROUTE } from "@/config/routes";

function SetNewPasswordContent() {
  return (
    <LoginShell
      contentMaxWidth="max-w-[343px]"
      showBack
      backHref={FORGOT_PASSWORD_ROUTE}
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
