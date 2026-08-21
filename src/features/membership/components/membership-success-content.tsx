"use client";

import { useRouter } from "next/navigation";
import { useActivePlayer } from "@/features/players/use-active-player";
import {
  CLAIM_RATINGS_ROUTE,
  SELECT_PLAYER_ROUTE,
} from "@/features/players/routes";
import { DEFAULT_REDIRECT } from "@/config/routes";

/**
 * Paid. What happens next depends on what is still outstanding, so this screen
 * confirms the payment and hands over rather than jumping straight to a
 * dashboard the parent has not yet chosen an occupant for.
 */
export default function MembershipSuccessContent() {
  const router = useRouter();
  const { children, needsMasterFileCheck, isLoading } = useActivePlayer();

  const playerCount = children.length;

  const handleContinue = () => {
    // Ratings first: every player has to be answered for before the app can
    // meaningfully show any of them.
    if (needsMasterFileCheck) {
      router.push(CLAIM_RATINGS_ROUTE);
      return;
    }

    router.push(playerCount > 1 ? SELECT_PLAYER_ROUTE : DEFAULT_REDIRECT);
  };

  // The account is re-read on arrival — how many players were just paid for,
  // and whether any lookups are still outstanding, both come from it. Showing
  // the finished screen before that lands would state a player count that then
  // changes under the reader.
  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-center gap-[26px]">
        <div className="h-[120px] w-[120px] animate-pulse rounded-full bg-[#F2F2F2]" />
        <div className="flex w-full flex-col items-center gap-4">
          <div className="h-8 w-3/5 animate-pulse rounded-full bg-[#F2F2F2]" />
          <div className="h-4 w-4/5 animate-pulse rounded-full bg-[#F2F2F2]" />
        </div>
        <div className="h-12 w-full animate-pulse rounded-[24px] bg-[#F2F2F2]" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-[26px]">
      <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#083F92]">
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M14 26L22 34L36 16"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex w-full flex-col items-center gap-4 text-center">
        <h1 className="text-[32px] font-semibold capitalize leading-[39px] text-[#083F92]">
          Congratulations
        </h1>
        <p className="text-base leading-[22px] text-[#565656]">
          {playerCount > 1
            ? `Memberships for all ${playerCount} players are now active.`
            : "Your membership payment was successful!"}
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={handleContinue}
          className="h-12 w-full cursor-pointer rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
