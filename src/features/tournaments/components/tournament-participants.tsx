"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  getDashboardPlayerProfileRoute,
  getPlayerProfileRoute,
} from "@/config/routes";
import { useTournamentParticipants } from "@/features/tournaments/hooks/use-tournament-participants";

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
      <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
      <path d="M16 16L21 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const gridCols =
  "grid-cols-[100px_120px_50px_50px_1fr_80px_126px]";

function TournamentParticipantsContent({
  context = "auth",
}: {
  context?: "auth" | "dashboard";
}) {
  const searchParams = useSearchParams();
  const tournamentId = searchParams.get("tournamentId");
  const { query, setQuery, participants, page, totalPages, setPage, backHref, context: resolvedContext } =
    useTournamentParticipants({ context, tournamentId });

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
              placeholder="Search"
              className="h-12 w-full rounded-[24px] border border-[#3D3775] bg-white pl-6 pr-14 text-sm font-light text-[#808080] outline-none"
            />
            <button
              type="button"
              className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#083F92]"
              aria-label="Search"
            >
              <SearchButtonIcon />
            </button>
          </div>
        </div>

        <button
          type="button"
          className="mb-6 flex items-center gap-2 rounded-full border border-[#F3F4F6] bg-white px-4 py-2 text-sm font-medium text-[#121111] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
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

          {participants.map((participant, index) => (
            <div
              key={participant.userId}
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
                href={getProfileRoute(participant.id)}
                className="text-right font-semibold tracking-[-0.02em] text-[#636363] underline"
              >
                View Profile
              </Link>
            </div>
          ))}

          <div className="absolute bottom-4 right-6 flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#EDEDED] disabled:opacity-50"
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
                  className={`min-w-[43px] px-4 py-2 text-sm font-bold capitalize ${
                    pageNumber === page
                      ? "rounded-full bg-[#083F92] text-white"
                      : "text-[#636363]"
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
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#EDEDED] disabled:opacity-50"
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
        </div>
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
