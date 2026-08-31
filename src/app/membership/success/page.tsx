import type { Metadata } from "next";
import { Suspense } from "react";
import { createPageMetadata } from "@/config/site-metadata";
import LoginShell from "@/features/auth/components/login-shell";
import MembershipSuccessContent from "@/features/membership/components/membership-success-content";

export const metadata: Metadata = createPageMetadata("membershipSuccess");

/**
 * The content reads PayPal's ?token= through useSearchParams, which opts the
 * subtree out of static prerendering unless it sits behind a Suspense
 * boundary. Without this the build fails on this route.
 */
export default function MembershipSuccessPage() {
  return (
    <LoginShell contentMaxWidth="max-w-[515px]" hideLogo>
      <Suspense
        fallback={
          <div className="flex w-full flex-col items-center gap-[26px]">
            <div className="h-[120px] w-[120px] animate-pulse rounded-full bg-[#F2F2F2]" />
            <div className="flex w-full flex-col items-center gap-4">
              <div className="h-8 w-3/5 animate-pulse rounded-full bg-[#F2F2F2]" />
              <div className="h-4 w-4/5 animate-pulse rounded-full bg-[#F2F2F2]" />
            </div>
            <div className="h-12 w-full animate-pulse rounded-[24px] bg-[#F2F2F2]" />
          </div>
        }
      >
        <MembershipSuccessContent />
      </Suspense>
    </LoginShell>
  );
}
