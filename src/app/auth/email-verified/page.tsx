import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import EmailVerifiedSuccess from "@/features/auth/components/email-verified-success";
import LoginShell from "@/features/auth/components/login-shell";

export const metadata: Metadata = createPageMetadata("emailVerified");

export default function EmailVerifiedPage() {
  return (
    <LoginShell contentMaxWidth="max-w-[343px]" contentClassName="justify-center" hideLogo>
      <EmailVerifiedSuccess />
    </LoginShell>
  );
}
