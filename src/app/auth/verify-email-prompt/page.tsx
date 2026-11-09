import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import LoginShell from "@/features/auth/components/login-shell";
import VerifyEmailPrompt from "@/features/auth/components/verify-email-prompt";

export const metadata: Metadata = createPageMetadata("verifyEmailPrompt");

export default function VerifyEmailPromptPage() {
  return (
    <LoginShell
      contentMaxWidth="max-w-[343px]"
      contentClassName="justify-center"
      hideLogo
    >
      <VerifyEmailPrompt />
    </LoginShell>
  );
}
