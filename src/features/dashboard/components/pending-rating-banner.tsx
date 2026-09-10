"use client";

import { useActivePlayer } from "@/features/players/use-active-player";

export default function PendingRatingBanner() {
  const { activePlayer, hasMultiplePlayers, isLoading } = useActivePlayer();

  if (isLoading || !activePlayer || activePlayer.ratingStatus !== "pending") {
    return null;
  }

  const playerName =
    activePlayer.firstName?.trim() || activePlayer.name?.trim() || "Your player";

  return (
    <aside
      role="status"
      aria-live="polite"
      className="w-full border-b border-[#FCD34D] bg-[#FEF3C7] text-[#92400E]"
    >
      <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-6 py-3 lg:px-0 text-sm font-medium leading-5">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F59E0B]/20 text-[#B45309]">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <p className="flex-1">
          <strong className="font-semibold">Rating Assignment Pending:</strong>{" "}
          {hasMultiplePlayers
            ? `${playerName}'s profile is pending rating assignment from an administrator. While pending, ${playerName} can only register for open tournament divisions (divisions with no rating requirement).`
            : "Your profile is pending rating assignment from an administrator. While pending, you can only register for open tournament divisions (divisions with no rating requirement)."}
        </p>
      </div>
    </aside>
  );
}
