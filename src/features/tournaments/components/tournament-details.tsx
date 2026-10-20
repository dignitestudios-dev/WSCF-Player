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
import ParticipantCards from "@/features/tournaments/components/participant-cards";
import {
  getDivisionCell,
  getTeamCell,
} from "@/features/tournaments/utils/participant-columns";

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

// No | Player | User ID | Division | Team | Rating | Action
const GRID_COLS = "grid grid-cols-[64px_1.2fr_1fr_1.3fr_1fr_100px_110px]";

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
      <div className="mx-auto max-w-[1240px] px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-8 lg:px-0">
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
      <div className="mx-auto max-w-[1240px] px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-8 lg:px-0">
        <Link
          href={backHref}
          className="mb-6 inline-flex min-h-11 items-center gap-2 pr-3 text-base font-medium leading-6 text-[#083F92] md:gap-3 md:pr-0 md:text-lg"
        >
          <BackIcon />
          Back
        </Link>
        <p className="text-lg text-[#151515]">Tournament not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-8 lg:px-0">
      <div className="mb-6 flex flex-col gap-3">
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center gap-2 pr-3 text-base font-medium leading-6 text-[#083F92] md:gap-3 md:pr-0 md:text-lg"
        >
          <BackIcon />
          Back
        </Link>
        <h1 className="text-[32px] font-bold leading-[44px] text-[#083F92] lg:text-[45px] lg:leading-[61px]">
          Tournament Details
        </h1>
      </div>

      {tournament && (
        <div className="mb-6 rounded-[16px] bg-white border border-[#E5E7EB] p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl md:text-2xl font-bold text-[#083F92]">{tournament.title}</h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#555]">
                <span>📍 {tournament.location}</span>
                <span>📅 {new Date(tournament.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                <span className="font-semibold text-[#151515]">
                  Entry Fee: {tournament.entryFee === 0 ? "Free" : `$${tournament.entryFee.toFixed(2)}`}
                </span>
              </div>
            </div>

            {tournament.payOnSite ? (
              <span className="inline-flex self-start md:self-center items-center rounded-full bg-[#EFF8FF] border border-[#B2DDFF] px-3.5 py-1 text-xs font-semibold text-[#175CD3]">
                Pay On-Site
              </span>
            ) : (
              <span className="inline-flex self-start md:self-center items-center rounded-full bg-[#E7F6EC] border border-[#A6F4C5] px-3.5 py-1 text-xs font-semibold text-[#036B26]">
                Online Payment
              </span>
            )}
          </div>

          {tournament.payOnSite ? (
            <div className="rounded-[12px] bg-[#F0F7FF] border border-[#B2DDFF] p-4 flex flex-col gap-1.5 text-xs text-[#1849A9] leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-[#175CD3]">
                <span>ℹ️</span>
                <span>Pay On-Site Tournament</span>
              </div>
              <p>
                <strong>No online fee or registration payment is required today.</strong> The entry fee of <strong>${tournament.entryFee.toFixed(2)}</strong> will be collected in-person at the venue on tournament day.
              </p>
              <p className="text-[#175CD3]">
                💡 <strong>Promo / Coupon Codes:</strong> If you have an organization or sponsor code, you can still apply it when registering to waive or discount your fee.
              </p>
            </div>
          ) : (
            <div className="rounded-[12px] bg-[#F9FAFB] border border-gray-200 p-3 text-xs text-[#555]">
              Entry fee is paid securely online via PayPal during checkout.
            </div>
          )}
        </div>
      )}

      <div className="relative rounded-[12px] bg-white/50 p-6 lg:p-8">
        <div className="mb-8 flex flex-col gap-3">
          <h2 className="text-[30px] font-bold leading-[41px] text-[#083F92]">
            Registered Players ({registeredCount})
          </h2>
          <p className="text-base font-medium leading-[22px] text-[#151515]">
            Players who joined this tournament
          </p>
        </div>

        {/* The table is for md and up; a phone gets the cards below. */}
        <div className="hidden overflow-x-auto md:block">
          <div className="min-w-[1040px]">
            <div
              className={`${GRID_COLS} h-[47px] items-center rounded-t-[12px] bg-[#083F92] px-6 text-base font-medium text-white`}
            >
              <span>No</span>
              <span>Player</span>
              <span>USER ID</span>
              <span>Division</span>
              <span>Team</span>
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
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-4 w-20 rounded" />
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
                const division = getDivisionCell(participant.division);
                const team = getTeamCell(participant.team);

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
                    <span className="truncate pr-2 min-w-0" title={userId}>{userId}</span>
                    <span className="truncate pr-2 min-w-0" title={division.hint ?? division.label}>{division.label}</span>
                    <span className="truncate pr-2 min-w-0" title={team}>{team}</span>
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

        <ParticipantCards
          participants={apiParticipants}
          isPending={isParticipantsPending}
          activePlayerId={activePlayer?._id}
        />

        {showViewAll ? (
          <div className="mt-6 flex md:justify-end">
            <Link
              href={getDashboardTournamentParticipantsRoute(tournament._id)}
              className="inline-flex h-12 w-full items-center justify-center rounded-[24px] bg-[#083F92] px-4 text-sm font-semibold text-white md:h-[39px] md:w-auto md:rounded-[8px] md:px-2.5 md:font-medium"
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
