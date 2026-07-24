"use client";

import Link from "next/link";
import { useMyHistory } from "@/features/dashboard/hooks/use-my-history";

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

function SortArrow() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 10L12 14L16 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg width="8" height="15" viewBox="0 0 8 15" fill="none" aria-hidden="true" className={className}>
      <path
        d="M7 1L1 7.5L7 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const GRID_COLS =
  "grid grid-cols-[minmax(140px,1.4fr)_100px_100px_80px_80px_110px_80px] gap-4";

function SortableHeader({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-0.5">
      {label}
      <SortArrow />
    </span>
  );
}

export default function MyHistory() {
  const { tournaments, page, totalPages, totalItems, pageSize, setPage, backHref, isPending } = useMyHistory();

  const pageNumbers = Array.from({ length: Math.min(totalPages, 3) }, (_, index) => index + 1);

  return (
    <div className="mx-auto max-w-[1240px] px-6 pb-12 pt-8 lg:px-0">
      <Link
        href={backHref}
        className="mb-3 inline-flex items-center gap-3 text-lg font-medium leading-6 text-[#083F92]"
      >
        <BackIcon />
        Back
      </Link>

      <h1 className="mb-3 text-[45px] font-bold leading-[61px] text-[#083F92]">My History</h1>
      <p className="mb-6 text-[22px] leading-[30px] text-[#151515]">
        View your past tournaments and performance.
      </p>

      <div className="overflow-x-auto bg-white">
        <div className="min-w-[900px]">
          <div
            className={`${GRID_COLS} rounded-t-[12px] bg-[#083F92] px-6 py-3 text-base font-medium leading-[22px] text-white`}
          >
            <span>Tournaments</span>
            <SortableHeader label="Date" />
            <SortableHeader label="Month" />
            <SortableHeader label="Year" />
            <SortableHeader label="Rating" />
            <SortableHeader label="Rating Change" />
            <span>Action</span>
          </div>

          {isPending ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className={`${GRID_COLS} items-center px-6 py-[11px] border-b border-[#DADADA]`}>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            ))
          ) : tournaments.length > 0 ? (
            tournaments.map((tournament: any, index: number) => (
              <div
                key={tournament.id}
                className={`${GRID_COLS} items-center px-6 py-[11px] text-base font-semibold leading-[22px] text-[#151515] ${
                  index < tournaments.length - 1 ? "border-b border-[#DADADA]" : ""
                }`}
              >
                <span>{tournament.name}</span>
                <span>{tournament.date}</span>
                <span>{tournament.month}</span>
                <span>{tournament.year}</span>
                <span>{tournament.rating}</span>
                <span>{tournament.ratingChange}</span>
                <button type="button" className="text-left font-semibold underline">
                  Result
                </button>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-[#727272]">
              No tournament history found.
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-base leading-6 text-[#083F92]">
          You have {pageSize} of {totalItems} Pages
        </p>

        <div className="flex h-[61px] items-center gap-2 rounded-full bg-white px-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="flex h-[43px] w-[43px] items-center justify-center rounded-full bg-[#EDEDED] disabled:opacity-50"
            aria-label="Previous page"
          >
            <ChevronLeft className="text-[#919191]" />
          </button>

          <div className="flex items-center rounded-full bg-[#EDEDED]">
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`flex h-[43px] min-w-[43px] items-center justify-center px-4 text-base capitalize ${
                  page === pageNumber
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
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            className="flex h-[43px] w-[43px] items-center justify-center rounded-full bg-[#EDEDED] disabled:opacity-50"
            aria-label="Next page"
          >
            <ChevronLeft className="rotate-180 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
