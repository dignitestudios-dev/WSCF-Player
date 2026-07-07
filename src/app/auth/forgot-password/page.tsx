import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import LoginShell from "@/features/auth/components/login-shell";
import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";
import { MEMBER_LOGIN_ROUTE } from "@/config/routes";

export const metadata: Metadata = createPageMetadata("forgotPassword");

export default function ForgotPasswordPage() {
  return (
    <LoginShell
      contentMaxWidth="max-w-[343px]"
      showBack
      backHref={MEMBER_LOGIN_ROUTE}
      hideLogo
    >
      <ForgotPasswordForm />
    </LoginShell>
  );
}
