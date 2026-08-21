"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MEMBERSHIP_VALIDATION_ROUTE } from "@/config/routes";
import {
  CLAIM_RATINGS_ROUTE,
  SELECT_PLAYER_ROUTE,
} from "@/features/players/routes";
import { useActivePlayer } from "@/features/players/use-active-player";

/**
 * Decides whether the dashboard can open yet.
 *
 * There are three things that have to be settled first, in this order:
 *
 *   1. every player is paid for — an unpaid player cannot enter anything
 *   2. every player has been through the record lookup once
 *   3. a player is actually selected, when there is more than one
 *
 * They are ordered deliberately: paying adds nothing to look up, and looking
 * up tells the parent who they are choosing between.
 *
 * This is the *only* place that ordering is enforced. The screens it sends
 * people to never redirect back here — when two screens each decide the other
 * should be showing, they bounce off one another until their caches happen to
 * agree, which is exactly what a single gate avoids.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    activePlayer,
    hasMultiplePlayers,
    needsMembershipPayment,
    needsMasterFileCheck,
    isLoading,
  } = useActivePlayer();

  // With one player there is nothing to choose, and the hook selects them; a
  // missing selection only matters when there are several.
  const needsSelection = hasMultiplePlayers && !activePlayer;

  const destination = needsMembershipPayment
    ? MEMBERSHIP_VALIDATION_ROUTE
    : needsMasterFileCheck
      ? CLAIM_RATINGS_ROUTE
      : needsSelection
        ? SELECT_PLAYER_ROUTE
        : null;

  const shouldRedirect = !isLoading && Boolean(destination) && pathname !== destination;

  // Sent once. A second navigation while the first is still in flight is what
  // turns a redirect into a loop.
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!shouldRedirect || !destination) {
      hasRedirected.current = false;
      return;
    }

    if (hasRedirected.current) return;
    hasRedirected.current = true;

    window.location.replace(destination);
  }, [shouldRedirect, destination]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F7F6FF]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#083F92] border-t-transparent" />
      </div>
    );
  }

  // Hold the dashboard back entirely while redirecting, rather than letting a
  // page render against the wrong player and then swap.
  if (shouldRedirect) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-[#F7F6FF]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#083F92] border-t-transparent" />
        <p className="text-lg font-medium text-[#083F92]">
          {needsMembershipPayment
            ? "Redirecting to membership setup..."
            : needsMasterFileCheck
              ? "Checking player records..."
              : "Choosing a player..."}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
