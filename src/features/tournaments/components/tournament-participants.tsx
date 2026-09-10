"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  getDashboardPlayerProfileRoute,
  getPlayerProfileRoute,
} from "@/config/routes";
import { useTournamentParticipants } from "@/features/tournaments/hooks/use-tournament-participants";
import { useTournamentDetailsQuery } from "@/features/tournaments/api/tournaments.queries";
import UpcomingTournamentsModal from "@/features/tournaments/components/upcoming-tournaments-modal";
import { Skeleton } from "@/components/ui/skeleton";

function SortArrows() {
  return (
    <span className="ml-1 inline-flex flex-col leading-none">
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
        <path d="M5 0L9.33 5H0.67L5 0Z" fill="white" />
      </svg>
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
        <path d="M5 6L0.67 1H9.33L5 6Z" fill="white" />
      </svg>
    </span>
  );
}

function SearchButtonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const gridCols =
  "grid-cols-[100px_minmax(120px,1.5fr)_80px_80px_minmax(150px,2fr)_100px_100px]";

function TournamentParticipantsContent({
  context = "auth",
}: {
  context?: "auth" | "dashboard";
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tournamentId = searchParams.get("tournamentId");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { query, setQuery, participants, page, totalPages, setPage, backHref, context: resolvedContext, isPending } =
    useTournamentParticipants({ context, tournamentId });

  const { data: detailsData } = useTournamentDetailsQuery(tournamentId || "");
  const tournamentTitle = detailsData?.data?.tournament?.title;

  const currentParams = searchParams.toString();
  const currentUrl = `${pathname}${currentParams ? `?${currentParams}` : ""}`;

  const getProfileRoute =
    resolvedContext === "dashboard" ? getDashboardPlayerProfileRoute : getPlayerProfileRoute;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="min-h-screen bg-[#F7F6FF] p-4">
      <div
        className="relative mx-auto min-h-[calc(100vh-2rem)] max-w-[1408px] rounded-none p-4 lg:p-6"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%), #F7F6FF",
        }}
      >
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center gap-3 text-lg font-medium text-[#083F92]"
        >
          <svg width="15" height="27" viewBox="0 0 15 27" fill="none" aria-hidden="true">
            <path
              d="M13 2L2 13.5L13 25"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </Link>

        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <h1 className="text-[32px] font-bold leading-[48px] text-[#083F92] lg:text-[42px] lg:leading-[63px]">
            Current Tournament Participants
          </h1>

          <div className="relative h-12 w-full max-w-[310px]">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by player name, member ID or team"
              disabled={!tournamentId}
              className="h-12 w-full rounded-[24px] border border-[#3D3775] bg-white pl-6 pr-14 text-sm font-light text-[#808080] outline-none disabled:opacity-60"
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
            <button
              type="button"
              className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#083F92] text-white disabled:opacity-60"
              aria-label="Search"
              disabled={!tournamentId}
            >
              <SearchButtonIcon />
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col items-start gap-1">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-full border border-[#F3F4F6] bg-white px-4 py-2 text-sm font-medium text-[#121111] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition hover:bg-gray-50"
          >
            Upcoming Tournaments
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M7 8L10 11L13 8"
                stroke="#3D3D3D"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          
          {tournamentTitle && (
            <p className="ml-2 mt-1 text-sm font-semibold text-[#083F92]">
              Selected: <span className="text-[#151515]">{tournamentTitle}</span>
            </p>
          )}
        </div>

        {!tournamentId ? (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-[#DADADA] bg-white py-20">
            <p className="text-lg font-medium text-[#151515]">No tournament selected.</p>
            <p className="mt-2 text-sm text-[#727272]">Click &quot;Upcoming Tournaments&quot; to select a tournament and view its participants.</p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-[24px] border border-[#DADADA] bg-white pb-20">
            <div className={`grid ${gridCols} items-center border-b-4 border-[#F4F4F4] bg-[#083F92] px-6 py-4 text-[13px] font-bold leading-5 text-white`}>
              <span>UserId</span>
              <span>Name</span>
              <span className="flex items-center">
                Grade
                <SortArrows />
              </span>
              <span className="flex items-center">
                Rating
                <SortArrows />
              </span>
              <span className="flex items-center">
                Team
                <SortArrows />
              </span>
              <span className="flex items-center">
                Division
                <SortArrows />
              </span>
              <span className="text-right">Action</span>
            </div>

            {isPending ? (
              <div className="flex flex-col">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`grid ${gridCols} items-center px-6 py-[15px] ${
                      i % 2 === 1 ? "bg-[rgba(8,63,146,0.1)]" : "bg-white"
                    }`}
                  >
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20 justify-self-end" />
                  </div>
                ))}
              </div>
            ) : participants.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm text-[#727272]">
                No participants found.
              </div>
            ) : (
              participants.map((participant, index) => (
                <div
                  key={participant.id}
                  className={`grid ${gridCols} items-center px-6 py-[15px] text-[13px] leading-5 text-[#636363] ${
                    index % 2 === 1 ? "bg-[rgba(8,63,146,0.1)]" : "bg-white"
                  }`}
                >
                  <span className="font-semibold">{participant.userId}</span>
                  <span className={participant.highlightName ? "font-bold" : "font-semibold"}>
                    {participant.name}
                  </span>
                  <span className={participant.highlightName ? "font-bold" : "font-semibold"}>
                    {participant.grade}
                  </span>
                  <span className="font-semibold">{participant.rating}</span>
                  <span className="font-semibold tracking-[-0.02em]">{participant.team}</span>
                  <span className="font-semibold">{participant.division}</span>
                  <Link
                    href={`${getProfileRoute(participant.id)}?backHref=${encodeURIComponent(currentUrl)}`}
                    className="text-right font-semibold tracking-[-0.02em] text-[#636363] underline hover:text-[#083F92]"
                  >
                    View Profile
                  </Link>
                </div>
              ))
            )}

            {totalPages > 1 && (
              <div className="absolute bottom-4 right-6 flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm border border-[#DADADA]">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#EDEDED] disabled:opacity-50 transition hover:bg-[#E0E0E0]"
                  aria-label="Previous page"
                >
                  <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
                    <path
                      d="M7 1L1 7L7 13"
                      stroke="#919191"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="flex items-center overflow-hidden rounded-full bg-[#EDEDED]">
                  {pages.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`min-w-[43px] px-4 py-2 text-sm font-bold capitalize transition ${
                        pageNumber === page
                          ? "rounded-full bg-[#083F92] text-white"
                          : "text-[#636363] hover:bg-[#E0E0E0]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#EDEDED] disabled:opacity-50 transition hover:bg-[#E0E0E0]"
                  aria-label="Next page"
                >
                  <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
                    <path
                      d="M1 1L7 7L1 13"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {isModalOpen && (
          <UpcomingTournamentsModal
            onClose={() => setIsModalOpen(false)}
            onSelect={(id) => {
              setIsModalOpen(false);
              router.push(`${pathname}?tournamentId=${id}`);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function TournamentParticipants({
  context = "auth",
}: {
  context?: "auth" | "dashboard";
}) {
  return (
    <Suspense fallback={null}>
      <TournamentParticipantsContent context={context} />
    </Suspense>
  );
}
