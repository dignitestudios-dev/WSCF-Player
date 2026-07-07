import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import VerifyOtpShell from "@/features/auth/components/verify-otp-shell";

export const metadata: Metadata = createPageMetadata("verifyOtp");

export default function VerifyOtpPage() {
  return <VerifyOtpShell />;
}
