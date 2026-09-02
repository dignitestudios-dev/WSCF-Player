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
      // The default for a logo-less screen pins content to the top with no
      // room beneath it, which leaves a form this short looking cramped
      // against the back arrow. Centred with breathing space above and below,
      // matching the other short auth screens.
      contentClassName="justify-center py-12 lg:py-16"
    >
      <ForgotPasswordForm />
    </LoginShell>
  );
}
