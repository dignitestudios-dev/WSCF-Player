"use client";

import Link from "next/link";
import { getDashboardPlayerProfileRoute } from "@/config/routes";
import { useTournamentRegisteredPlayers } from "@/features/tournaments/hooks/use-tournament-registered-players";
import { useTournamentParticipantsQuery, useTournamentDetailsQuery } from "@/features/tournaments/api/tournaments.queries";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/ui/custom-pagination";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="#083F92" strokeWidth="2" />
      <path d="M12.5 12.5L16 16" stroke="#083F92" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

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

const GRID_COLS = "grid grid-cols-[126px_1.2fr_1fr_120px_120px]";

interface TournamentRegisteredPlayersProps {
  tournamentId: string;
}

export default function TournamentRegisteredPlayers({ tournamentId }: TournamentRegisteredPlayersProps) {
  const { backHref } = useTournamentRegisteredPlayers(tournamentId);
  const { data: detailsData, isPending: isDetailsPending } = useTournamentDetailsQuery(tournamentId);
  
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  const { data, isPending } = useTournamentParticipantsQuery(tournamentId, {
    page,
    limit: 10,
    search: debouncedQuery,
  });

  const apiParticipants = data?.data.participants || [];
  const pagination = data?.pagination;
  const tournament = detailsData?.data.tournament;

  if (isDetailsPending) {
    return (
      <div className="mx-auto max-w-[1240px] px-6 pb-12 pt-8 lg:px-0">
        <div className="mb-6 flex flex-col gap-3">
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-[44px] w-64 rounded lg:h-[61px] lg:w-96" />
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
          Registered Players
        </h1>
      </div>

      <div className="mb-8 flex h-[61px] max-w-[610px] items-center gap-3 rounded-[44px] border border-[#083F92] bg-white px-3">
        <SearchIcon />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search players by name or user id"
          className="w-full bg-transparent text-base font-medium text-[#151515] outline-none placeholder:text-[#ADADAD]"
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onMouseDown={(event) => {
              event.preventDefault();
              setQuery('');
            }}
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#ADADAD] transition-colors hover:bg-[#F2F2F2] hover:text-[#151515]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
      </div>

      <div className="relative">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div
              className={`${GRID_COLS} h-[47px] items-center rounded-t-[12px] bg-[#083F92] px-5 text-base font-semibold text-white`}
            >
              <span>No</span>
              <span>Player</span>
              <span>USER ID</span>
              <span>Rating</span>
              <span className="text-right">Action</span>
            </div>

            {isPending ? (
              <div className="flex flex-col">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`${GRID_COLS} h-[47px] items-center border-b border-[#DADADA] bg-white px-5 last:border-b-0`}
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
                
                return (
                  <div
                    key={participant._id}
                    className={`${GRID_COLS} h-[47px] items-center border-b border-[#DADADA] bg-white px-5 text-base font-medium text-[#151515] last:border-b-0`}
                  >
                    <span>{index + 1}</span>
                    <span>{participant.user.name}</span>
                    <span>{userId}</span>
                    <span>
                      <span className="inline-flex h-8 min-w-[78px] items-center justify-center rounded-[22px] bg-[#083F92] px-3 text-base font-medium text-white">
                        {rating}
                      </span>
                    </span>
                    <span className="text-right">
                      <Link
                        href={getDashboardPlayerProfileRoute(participant.user._id)}
                        className="text-sm font-medium leading-[19px] text-[#151515] hover:text-[#083F92]"
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

        {pagination && pagination.totalPages > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-base text-[#083F92]">
              You are on page {pagination.currentPage} of {pagination.totalPages} Pages
            </p>
            <CustomPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
