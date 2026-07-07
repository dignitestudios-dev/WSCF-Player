import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import MembershipValidation from "@/features/auth/components/membership-validation";
import LoginShell from "@/features/auth/components/login-shell";

export const metadata: Metadata = createPageMetadata("membershipValidation");

export default function MembershipValidationPage() {
  return (
    <LoginShell contentMaxWidth="max-w-[398px]" contentClassName="justify-start pt-16 lg:pt-20" hideLogo>
      <MembershipValidation />
    </LoginShell>
  );
}
