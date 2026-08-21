"use client";

import { Check, Ban } from "lucide-react";
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

  // Deactivation is per player: this one cannot be opened, but their siblings
  // are unaffected and the parent still signs in normally.
  const isDeactivated = player.status === "inactive" || player.isActive === false;

  return (
    <button
      type="button"
      onClick={isDeactivated ? undefined : onSelect}
      disabled={isDeactivated}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-4 rounded-[20px] border bg-white p-4 text-left transition-colors",
        isDeactivated
          ? "cursor-not-allowed border-[#DADADA] opacity-60"
          : selected
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
        {isDeactivated ? (
          <span className="mt-1 w-fit rounded-full bg-[#FDECEA] px-2.5 py-0.5 text-xs font-medium text-[#B42318]">
            Deactivated
          </span>
        ) : !membershipActive ? (
          <span className="mt-1 w-fit rounded-full bg-[#FDECEA] px-2.5 py-0.5 text-xs font-medium text-[#B42318]">
            Membership expired
          </span>
        ) : null}

        {/* Whatever the admin wrote when they deactivated this player — it is
            the only explanation the parent gets, so it is shown in full. */}
        {isDeactivated && player.deactivationReason ? (
          <p className="mt-1 text-xs leading-4 text-[#B42318]">
            {player.deactivationReason}
          </p>
        ) : null}
      </div>

      {isDeactivated ? (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FDECEA]">
          <Ban className="h-3.5 w-3.5 text-[#B42318]" />
        </span>
      ) : (
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
      )}
    </button>
  );
}
