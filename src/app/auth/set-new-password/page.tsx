import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import SetNewPasswordPageContent from "@/features/auth/components/set-new-password-page-content";

export const metadata: Metadata = createPageMetadata("setNewPassword");

export default function SetNewPasswordPage() {
  return <SetNewPasswordPageContent />;
}
