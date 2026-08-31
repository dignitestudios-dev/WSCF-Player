"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CLAIM_RATINGS_ROUTE } from "@/features/players/routes";

/**
 * The old single-player record lookup.
 *
 * An account now holds several players and each one is matched separately, so
 * this screen has moved to /players/claim-ratings. The route is kept because
 * PayPal redirects and old links still point at it.
 */
export default function MembershipSelectProfileContent() {
  const router = useRouter();

  useEffect(() => {
    router.replace(CLAIM_RATINGS_ROUTE);
  }, [router]);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="h-6 w-2/3 animate-pulse rounded-full bg-[#F2F2F2]" />
      <div className="h-[84px] w-full animate-pulse rounded-[24px] bg-[#F2F2F2]" />
    </div>
  );
}
