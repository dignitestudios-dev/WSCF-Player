import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import LoginShell from "@/features/auth/components/login-shell";
import ClaimRatingsContent from "@/features/players/components/claim-ratings-content";

export const metadata: Metadata = createPageMetadata("claimRatings");

export default function ClaimRatingsPage() {
  return (
    <LoginShell contentMaxWidth="max-w-[515px]" hideLogo>
      <ClaimRatingsContent />
    </LoginShell>
  );
}
