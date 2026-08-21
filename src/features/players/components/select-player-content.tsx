"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PlayerCard from "@/features/players/components/player-card";
import { useActivePlayer } from "@/features/players/use-active-player";
import { DEFAULT_REDIRECT } from "@/config/routes";

/**
 * Which of your children am I opening?
 *
 * Shown after signing in and after paying, but only when there is a genuine
 * choice: with one child the app selects them and moves straight on, so this
 * screen never appears.
 */
export default function SelectPlayerContent() {
  const router = useRouter();
  const {
    children,
    selectablePlayers,
    activePlayer,
    hasMultiplePlayers,
    isLoading,
    switchTo,
  } = useActivePlayer();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Handing over is one-way and happens once.
  const hasHandedOver = useRef(false);

  useEffect(() => {
    if (activePlayer?._id) setSelectedId(activePlayer._id);
  }, [activePlayer?._id]);

  // With nothing to choose between there is no decision to make, so the only
  // child is selected and the screen hands straight over.
  //
  // It deliberately does NOT send anyone back to the record lookup. Both
  // screens redirecting at each other made them bounce: this one reads the
  // account while the lookup screen reads the child list, and until both
  // caches agree each is convinced the other should be showing. Ordering is
  // enforced in one place — the dashboard's guard — so every redirect here
  // only ever moves forward.
  useEffect(() => {
    if (isLoading || hasHandedOver.current) return;

    // Only one player they can actually open: nothing to choose, so open it.
    if (selectablePlayers.length === 1) {
      hasHandedOver.current = true;
      switchTo(selectablePlayers[0]._id);
      router.replace(DEFAULT_REDIRECT);
    }
  }, [isLoading, selectablePlayers, router, switchTo]);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-3">
        {[0, 1].map((key) => (
          <div
            key={key}
            className="h-[84px] w-full animate-pulse rounded-[20px] bg-[#F2F2F2]"
          />
        ))}
      </div>
    );
  }

  if (!hasMultiplePlayers) return null;

  const openDashboard = () => {
    if (!selectedId) return;
    switchTo(selectedId);
    router.replace(DEFAULT_REDIRECT);
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-6 flex w-full flex-col items-center gap-2 text-center">
        <h1 className="text-[28px] font-semibold leading-9 text-[#083F92]">
          Who are we opening?
        </h1>
        <p className="text-sm font-medium leading-5 text-[#565656]">
          Pick a player to continue. You can switch at any time from your
          profile menu.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        {children.map((player) => (
          <PlayerCard
            key={player._id}
            player={player}
            selected={player._id === selectedId}
            onSelect={() => setSelectedId(player._id)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={openDashboard}
        disabled={!selectedId}
        className="mt-6 h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
}
