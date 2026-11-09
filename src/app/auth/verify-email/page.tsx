import type { Metadata } from "next";
import { Suspense } from "react";
import { createPageMetadata } from "@/config/site-metadata";
import LoginShell from "@/features/auth/components/login-shell";
import VerifyEmailLink from "@/features/auth/components/verify-email-link";

// The address carries a one-time token; keep it out of the Referer header of
// anything this page loads.
export const metadata: Metadata = {
  ...createPageMetadata("verifyEmail"),
  referrer: "no-referrer",
};

export default function VerifyEmailPage() {
  return (
    <LoginShell
      contentMaxWidth="max-w-[343px]"
      contentClassName="justify-center"
      hideLogo
    >
      <Suspense fallback={null}>
        <VerifyEmailLink />
      </Suspense>
    </LoginShell>
  );
}
