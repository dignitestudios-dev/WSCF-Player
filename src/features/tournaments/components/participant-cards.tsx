"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardPlayerProfileRoute } from "@/config/routes";
import {
  getDivisionCell,
  getTeamCell,
} from "@/features/tournaments/utils/participant-columns";

/**
 * A tournament's registered players as a list of cards, for phones.
 *
 * The desktop table has seven columns, which cannot fit a 375px screen — it used
 * to hide everything past "Player" behind a sideways scroll nobody found. Here
 * each player is one card: who they are, which division and team, their rating,
 * and the whole card opens their profile (one big target, not a 15px "View
 * Profile" link).
 *
 * Rendered below `md` only; the table owns `md` and up.
 */
export default function ParticipantCards({
  participants,
  isPending,
  activePlayerId,
  startIndex = 0,
  skeletonCount = 5,
}: {
  participants: TournamentParticipantApiData[];
  isPending: boolean;
  /** The player the parent is acting as, so their own row can be marked. */
  activePlayerId?: string;
  /** Rank offset, so page 2 continues from 11 rather than restarting at 1. */
  startIndex?: number;
  skeletonCount?: number;
}) {
  if (isPending) {
    return (
      <div className="flex flex-col gap-3 md:hidden" aria-busy="true">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Card key={i} className="flex items-center gap-3 rounded-2xl p-4 shadow-none">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-8 w-14 rounded-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-[#727272] md:hidden">
        No registered players found.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3 md:hidden">
      {participants.map((participant, index) => {
        const id = participant.user._id;
        const membershipId = participant.playerProfile?.membershipId ?? id;
        const rating = participant.playerProfile?.rating ?? 0;
        const division = getDivisionCell(participant.division);
        const team = getTeamCell(participant.team);
        const isMe = id === activePlayerId;

        return (
          <li key={participant._id}>
            <Link
              href={getDashboardPlayerProfileRoute(id)}
              aria-label={`${participant.user.name}, view profile`}
              className="block rounded-2xl outline-none transition-transform active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#083F92]/40"
            >
              <Card className="flex items-center gap-3 rounded-2xl border-[#E4E4EC] p-4 shadow-none">
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#083F92]/10 text-sm font-semibold text-[#083F92]"
                >
                  {startIndex + index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-base font-semibold leading-5 text-[#181818]">
                      {participant.user.name}
                    </p>
                    {isMe ? (
                      <Badge className="shrink-0 bg-[#083F92]/10 text-[#083F92]">
                        You
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-[#636363]">
                    {membershipId}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      title={division.hint}
                      className="max-w-full truncate"
                    >
                      {division.label}
                    </Badge>
                    <Badge variant="outline" className="max-w-full truncate">
                      {team}
                    </Badge>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="inline-flex h-8 min-w-[56px] items-center justify-center rounded-full bg-[#083F92] px-3 text-sm font-medium text-white">
                    {rating}
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#9A9AA5]" aria-hidden />
                </div>
              </Card>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
