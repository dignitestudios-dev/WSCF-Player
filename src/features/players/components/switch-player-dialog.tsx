"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import PlayerCard from "@/features/players/components/player-card";
import { useActivePlayer } from "@/features/players/use-active-player";
import { ADD_PLAYER_ROUTE } from "@/features/players/routes";

/**
 * Switching the app to another child.
 *
 * Opens on the current player already selected, and does nothing until the
 * parent presses Switch — tapping a card is a choice, not the action.
 */
export default function SwitchPlayerDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { children, activePlayer, switchTo } = useActivePlayer();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Reopening starts from whoever is current, not from the last thing tapped.
  useEffect(() => {
    if (open) setSelectedId(activePlayer?._id ?? null);
  }, [open, activePlayer?._id]);

  if (!open) return null;

  const isUnchanged = !selectedId || selectedId === activePlayer?._id;

  const confirmSwitch = () => {
    if (isUnchanged) {
      onClose();
      return;
    }

    switchTo(selectedId);
    onClose();
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default bg-black/40"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-[480px] flex-col overflow-hidden rounded-[24px] bg-white shadow-xl">
        <div className="shrink-0 border-b border-[#F4F4F4] px-6 py-5">
          <h2 className="text-xl font-semibold leading-7 text-[#083F92]">
            Switch Player
          </h2>
          <p className="mt-1 text-sm leading-5 text-[#636363]">
            Choose which player to view. Everything in the app will show their
            details.
          </p>
        </div>

        {/* The only scrolling part. `min-h-0` is what lets a flex child
            actually shrink — without it the list refuses to scroll and pushes
            the buttons off the bottom instead. */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-6 py-5">
          {children.map((player) => (
            <PlayerCard
              key={player._id}
              player={player}
              selected={player._id === selectedId}
              onSelect={() => setSelectedId(player._id)}
            />
          ))}
        </div>

        {/* Outside the scroll on purpose: with several players this used to sit
            below the fold, so the one action that adds a player was the one you
            had to scroll to find. */}
        <div className="shrink-0 px-6 pb-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push(ADD_PLAYER_ROUTE);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-[24px] border border-dashed border-[#3D3775]/40 bg-[#F7F6FF] px-4 py-4 text-sm font-semibold text-[#083F92] transition-colors hover:border-[#3D3775] hover:bg-[#ECEAFF]"
          >
            <UserPlus className="h-4 w-4" />
            Add another player
          </button>
        </div>

        <div className="flex shrink-0 gap-3 border-t border-[#F4F4F4] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-12 w-full rounded-[24px] border border-[#3D3775] bg-white text-sm font-semibold capitalize text-[#3D3775] transition-colors hover:bg-[#F7F6FF]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmSwitch}
            disabled={isUnchanged}
            className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-50"
          >
            Switch
          </button>
        </div>
      </div>
    </div>
  );
}
