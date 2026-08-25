"use client";

import Link from "next/link";
import { getDashboardPlayerProfileRoute } from "@/config/routes";
import { useDashboardPlayersRatingLookup } from "@/features/dashboard/hooks/use-dashboard-players-rating-lookup";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/ui/custom-pagination";

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

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="#000000" strokeWidth="2" />
      <path d="M12.5 12.5L16 16" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M12 4L4 12M4 4L12 12"
        stroke="#5871EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DashboardPlayersRatingLookup() {
  const { query, setQuery, filteredPlayers, isPending, setPage, pagination, backHref } = useDashboardPlayersRatingLookup();

  return (
    <div className="mx-auto max-w-[80em] px-6 pb-12 pt-8 lg:px-0">
      <div className="flex flex-col gap-3">
        <Link
          href={backHref}
          className="inline-flex w-fit items-center gap-3 px-6 text-lg font-medium leading-6 text-[#083F92]"
        >
          <BackIcon />
          Back
        </Link>

        <div className="flex h-[61px] items-center gap-3 rounded-[44px] border border-[#083F92] bg-white px-3">
          <SearchIcon />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search and view player ratings by name or a USER ID"
            className="min-w-0 flex-1 bg-transparent text-base font-medium text-[#151515] outline-none placeholder:text-[#ADADAD]"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="shrink-0"
            >
              <ClearIcon />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        {isPending ? (
          <div className="overflow-hidden rounded-[12px] border border-[#DADADA] bg-white">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`flex min-h-[68px] items-center justify-between gap-4 px-5 py-3 ${
                  i < 4 ? "border-b border-[#DADADA]" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-5 w-24 shrink-0" />
              </div>
            ))}
          </div>
        ) : filteredPlayers.length > 0 ? (
          <div className="overflow-hidden rounded-[12px] border border-[#DADADA] bg-white">
            {filteredPlayers.map((player: { id: string; name: string; userId: string; rating: number; team: string }, index: number) => (
              <Link
                key={player.id}
                href={getDashboardPlayerProfileRoute(player.id)}
                className={`flex min-h-[68px] items-center justify-between gap-4 px-5 py-3 transition hover:bg-[#F7F6FF] ${
                  index < filteredPlayers.length - 1 ? "border-b border-[#DADADA]" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-base font-medium text-[#151515]">{player.name}</p>
                  <p className="mt-1 text-sm text-[#727272]">
                    USER ID: {player.userId} &nbsp;|&nbsp; Rating: {player.rating}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium text-[#083F92]">View Profile</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-center text-sm text-[#727272]">No players found.</p>
        )}
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
  );
}
