import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import LoginShell from "@/features/auth/components/login-shell";
import MembershipCancelContent from "@/features/membership/components/membership-cancel-content";

export const metadata: Metadata = createPageMetadata("membershipCancel");

export default function MembershipCancelPage() {
  return (
    <LoginShell contentMaxWidth="max-w-[515px]" hideLogo>
      <MembershipCancelContent />
    </LoginShell>
  );
}
