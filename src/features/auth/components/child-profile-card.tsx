"use client";

import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import type { ChildFormData } from "@/features/auth/schemas/child.schema";
import { parseCalendarDate } from "@/lib/calendar-date";

/** First initials, so a card reads as a person before you read the name. */
function initials(child: ChildFormData) {
  return `${child.firstName.charAt(0)}${child.lastName.charAt(0)}`.toUpperCase();
}

/**
 * One player added during signup, before any of it has been saved.
 *
 * Removal is offered here and nowhere else: until the account exists these are
 * drafts, and a mistyped player has to be undoable. Once saved, a player can
 * be edited but never removed.
 */
export default function ChildProfileCard({
  child,
  onEdit,
  onRemove,
}: {
  child: ChildFormData;
  onEdit: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[24px] border border-[#D8D4FF] bg-[#F7F6FF] p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#083F92] text-base font-semibold text-white">
        {initials(child)}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-base font-semibold leading-[22px] text-[#181818]">
          {child.firstName} {child.lastName}
        </p>
        <p className="truncate text-sm leading-5 text-[#565656]">
          Grade {child.grade}
          {child.birthDate
            ? ` · Born ${format(parseCalendarDate(child.birthDate)!, "d MMM yyyy")}`
            : ""}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${child.firstName}`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#083F92] text-white transition-opacity hover:opacity-90"
        >
          <Pencil className="h-4 w-4" />
        </button>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${child.firstName}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D92D20] text-white transition-opacity hover:opacity-90"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
