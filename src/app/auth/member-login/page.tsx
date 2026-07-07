import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import LoginShell from "@/features/auth/components/login-shell";
import MemberLoginForm from "@/features/auth/components/member-login-form";
import { AUTH_REDIRECT } from "@/config/routes";

export const metadata: Metadata = createPageMetadata("memberLogin");

export default function MemberLoginPage() {
  return (
    <LoginShell contentMaxWidth="max-w-[400px]" showBack backHref={AUTH_REDIRECT}>
      <MemberLoginForm />
    </LoginShell>
  );
}
