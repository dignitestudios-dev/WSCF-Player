import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import LoginShell from "@/features/auth/components/login-shell";
import PaymentCancelContent from "@/features/tournaments/components/payment-cancel-content";

export const metadata: Metadata = createPageMetadata("paymentCancel");

export default function PaymentCancelPage() {
  return (
    <LoginShell contentMaxWidth="max-w-[515px]" hideLogo>
      <PaymentCancelContent />
    </LoginShell>
  );
}
