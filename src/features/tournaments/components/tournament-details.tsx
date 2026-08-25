"use client";

import { Suspense } from "react";
import Link from "next/link";
import {
  getDashboardPlayerProfileRoute,
  getDashboardTournamentParticipantsRoute,
} from "@/config/routes";
import { useTournamentDetails } from "@/features/tournaments/hooks/use-tournament-details";
import { useTournamentParticipantsQuery, useTournamentDetailsQuery } from "@/features/tournaments/api/tournaments.queries";
import { useActivePlayer } from "@/features/players/use-active-player";
import { Skeleton } from "@/components/ui/skeleton";

function BackIcon() {
  return (
    <svg width="15" height="27" viewBox="0 0 15 27" fill="none" aria-hidden="true">
      <path
        d="M13 2L2 13.5L13 25"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const GRID_COLS = "grid grid-cols-[80px_1.2fr_1fr_120px_120px]";

interface TournamentDetailsProps {
  tournamentId: string;
}

function TournamentDetailsContent({ tournamentId }: TournamentDetailsProps) {
  const { backHref } = useTournamentDetails(tournamentId);
  const { data: detailsData, isPending: isDetailsPending } = useTournamentDetailsQuery(tournamentId);
  const { data: participantsData, isPending: isParticipantsPending } = useTournamentParticipantsQuery(tournamentId, { page: 1, limit: 10 });
  
  const apiParticipants = participantsData?.data.participants || [];
  const { activePlayer } = useActivePlayer();
  const registeredCount = participantsData?.pagination?.totalItems ?? 0;
  const showViewAll = (participantsData?.pagination?.totalPages ?? 0) > 1;
  const tournament = detailsData?.data.tournament;

  if (isDetailsPending) {
    return (
      <div className="mx-auto max-w-[1240px] px-6 pb-12 pt-8 lg:px-0">
        <div className="mb-6 flex flex-col gap-3">
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-[44px] w-64 rounded lg:h-[61px] lg:w-96" />
        </div>
        <div className="relative rounded-[12px] bg-white/50 p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-3">
            <Skeleton className="h-[41px] w-64 rounded" />
            <Skeleton className="h-[22px] w-48 rounded" />
          </div>
          <Skeleton className="h-[400px] w-full rounded" />
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="mx-auto max-w-[1240px] px-6 pb-12 pt-8 lg:px-0">
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center gap-3 text-lg font-medium leading-6 text-[#083F92]"
        >
          <BackIcon />
          Back
        </Link>
        <p className="text-lg text-[#151515]">Tournament not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px] px-6 pb-12 pt-8 lg:px-0">
      <div className="mb-6 flex flex-col gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-3 text-lg font-medium leading-6 text-[#083F92]"
        >
          <BackIcon />
          Back
        </Link>
        <h1 className="text-[32px] font-bold leading-[44px] text-[#083F92] lg:text-[45px] lg:leading-[61px]">
          Tournament Details
        </h1>
      </div>

      <div className="relative rounded-[12px] bg-white/50 p-6 lg:p-8">
        <div className="mb-8 flex flex-col gap-3">
          <h2 className="text-[30px] font-bold leading-[41px] text-[#083F92]">
            Registered Players ({registeredCount})
          </h2>
          <p className="text-base font-medium leading-[22px] text-[#151515]">
            Players who joined this tournament
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div
              className={`${GRID_COLS} h-[47px] items-center rounded-t-[12px] bg-[#083F92] px-6 text-base font-medium text-white`}
            >
              <span>No</span>
              <span>Player</span>
              <span>USER ID</span>
              <span>Rating</span>
              <span className="text-right">Action</span>
            </div>

            {isParticipantsPending ? (
              <div className="flex flex-col">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`${GRID_COLS} h-[47px] items-center border-b border-[#F2F2F2] bg-white px-6 last:border-b-0`}
                  >
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-8 w-[78px] rounded-[22px]" />
                    <Skeleton className="h-4 w-16 justify-self-end rounded" />
                  </div>
                ))}
              </div>
            ) : apiParticipants.length === 0 ? (
              <div className="flex items-center justify-center h-[47px] text-sm text-[#727272]">
                No registered players found.
              </div>
            ) : (
              apiParticipants.map((participant, index) => {
                const userId = participant.playerProfile?.membershipId || participant.user._id;
                const rating = participant.playerProfile?.rating || 0;
                // The parent is looking at a list their own child is in, so
                // say which row that is rather than leaving them to spot the
                // name themselves.
                const isMe = participant.user._id === activePlayer?._id;

                return (
                  <div
                    key={participant._id}
                    className={`${GRID_COLS} h-[47px] items-center border-b border-[#F2F2F2] bg-white px-6 text-base font-medium text-[#151515] last:border-b-0`}
                  >
                    <span>{index + 1}</span>
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="truncate">{participant.user.name}</span>
                      {isMe ? (
                        <span className="shrink-0 rounded-full bg-[#083F92]/10 px-2 py-0.5 text-xs font-semibold text-[#083F92]">
                          You
                        </span>
                      ) : null}
                    </span>
                    <span>{userId}</span>
                    <span>
                      <span className="inline-flex h-8 min-w-[78px] items-center justify-center rounded-[22px] bg-[#083F92] px-3 text-base font-medium text-white">
                        {rating}
                      </span>
                    </span>
                    <span className="text-right">
                      <Link
                        href={getDashboardPlayerProfileRoute(participant.user._id)}
                        className="text-xs font-medium leading-4 text-[#151515] hover:text-[#083F92]"
                      >
                        View Profile
                      </Link>
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {showViewAll ? (
          <div className="mt-6 flex justify-end">
            <Link
              href={getDashboardTournamentParticipantsRoute(tournament._id)}
              className="inline-flex h-[39px] items-center justify-center rounded-[8px] bg-[#083F92] px-2.5 text-sm font-medium text-white"
            >
              View All
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function TournamentDetails({ tournamentId }: TournamentDetailsProps) {
  return (
    <Suspense fallback={null}>
      <TournamentDetailsContent tournamentId={tournamentId} />
    </Suspense>
  );
}
