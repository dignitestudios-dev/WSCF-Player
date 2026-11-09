import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import SetNewPasswordPageContent from "@/features/auth/components/set-new-password-page-content";

// The address carries a one-time token; keep it out of the Referer header of
// anything this page loads.
export const metadata: Metadata = {
  ...createPageMetadata("setNewPassword"),
  referrer: "no-referrer",
};

export default function SetNewPasswordPage() {
  return <SetNewPasswordPageContent />;
}
