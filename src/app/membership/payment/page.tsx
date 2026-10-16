import { Suspense } from "react";
import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import MembershipPayment from "@/features/membership/components/membership-payment";
import LoginShell from "@/features/auth/components/login-shell";

export const metadata: Metadata = createPageMetadata("membershipPayment");

export default function MembershipPaymentPage() {
  return (
    <LoginShell contentMaxWidth="max-w-[398px]" contentClassName="justify-start pt-16 lg:pt-20" hideLogo>
      <Suspense fallback={null}>
        <MembershipPayment />
      </Suspense>
    </LoginShell>
  );
}
