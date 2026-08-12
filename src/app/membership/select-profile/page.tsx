import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import LoginShell from "@/features/auth/components/login-shell";
import MembershipSelectProfileContent from "@/features/membership/components/membership-select-profile-content";

export const metadata: Metadata = createPageMetadata("membershipSelectProfile");

export default function MembershipSelectProfilePage() {
  return (
    <LoginShell contentMaxWidth="max-w-[515px]" hideLogo>
      <MembershipSelectProfileContent />
    </LoginShell>
  );
}
