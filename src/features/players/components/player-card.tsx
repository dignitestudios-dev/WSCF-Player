"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

function initials(player: PlayerChild) {
  return `${player.firstName?.charAt(0) ?? ""}${player.lastName?.charAt(0) ?? ""}`.toUpperCase();
}

/**
 * One player, as a selectable row.
 *
 * Used by both the picker shown after signing in and the switch dialog, so the
 * two never drift apart. An expired membership is called out here rather than
 * blocking selection: the parent still needs to get in and renew.
 */
export default function PlayerCard({
  player,
  selected = false,
  onSelect,
}: {
  player: PlayerChild;
  selected?: boolean;
  onSelect: () => void;
}) {
  const membershipActive = player.membership?.status === "active";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-4 rounded-[20px] border bg-white p-4 text-left transition-colors",
        selected
          ? "border-[#083F92] bg-[#F2F6FF] shadow-[0px_4px_12px_rgba(8,63,146,0.12)]"
          : "border-[#DADADA] hover:border-[#083F92]/50 hover:bg-[#F7F6FF]",
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#083F92] text-base font-semibold text-white">
        {initials(player)}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-base font-semibold leading-[22px] text-[#121111]">
          {player.name || `${player.firstName} ${player.lastName}`}
        </p>
        <p className="truncate text-sm leading-5 text-[#636363]">
          {player.grade ? `Grade ${player.grade}` : "Grade not set"}
          {player.membershipId ? ` · ${player.membershipId}` : ""}
          {typeof player.rating === "number" ? ` · ${player.rating}` : ""}
        </p>
        {!membershipActive && (
          <span className="mt-1 w-fit rounded-full bg-[#FDECEA] px-2.5 py-0.5 text-xs font-medium text-[#B42318]">
            Membership expired
          </span>
        )}
      </div>

      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
          selected
            ? "border-[#083F92] bg-[#083F92]"
            : "border-[#DADADA] bg-white",
        )}
      >
        {selected && <Check className="h-3.5 w-3.5 text-white" />}
      </span>
    </button>
  );
}
