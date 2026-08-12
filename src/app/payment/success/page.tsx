import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import LoginShell from "@/features/auth/components/login-shell";
import PaymentSuccessContent from "@/features/tournaments/components/payment-success-content";

export const metadata: Metadata = createPageMetadata("paymentSuccess");

export default function PaymentSuccessPage() {
  return (
    <LoginShell contentMaxWidth="max-w-[515px]" hideLogo>
      <PaymentSuccessContent />
    </LoginShell>
  );
}
