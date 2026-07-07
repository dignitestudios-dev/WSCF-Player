import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import LoginShell from "@/features/auth/components/login-shell";
import MembershipSuccessContent from "@/features/membership/components/membership-success-content";

export const metadata: Metadata = createPageMetadata("membershipSuccess");

export default function MembershipSuccessPage() {
  return (
    <LoginShell contentMaxWidth="max-w-[515px]" hideLogo>
      <MembershipSuccessContent />
    </LoginShell>
  );
}
