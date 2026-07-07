import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import BecomeMemberForm from "@/features/auth/components/become-member-form";
import LoginShell from "@/features/auth/components/login-shell";
import { AUTH_REDIRECT } from "@/config/routes";

export const metadata: Metadata = createPageMetadata("register");

export default function RegisterPage() {
  return (
    <LoginShell
      contentMaxWidth="max-w-[640px]"
      contentClassName="justify-start pt-16 lg:pt-8"
      showBack
      backHref={AUTH_REDIRECT}
      hideLogo
      matchLeftPanelToContent
    >
      <BecomeMemberForm />
    </LoginShell>
  );
}
