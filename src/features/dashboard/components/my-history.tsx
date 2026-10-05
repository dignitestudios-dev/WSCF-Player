"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { useMyHistory } from "@/features/dashboard/hooks/use-my-history";

function BackIcon({ className }: { className?: string }) {
  return (
    <svg
      width="15"
      height="27"
      viewBox="0 0 15 27"
      fill="none"
      aria-hidden="true"
      className={className}
    >
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

const GRID_COLS =
  "grid grid-cols-[minmax(140px,1.4fr)_100px_100px_80px_80px_110px_80px] gap-4";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HistoryRow = any;

/** What the place column shows, shared by the table and the phone card. */
function Place({ tournament }: { tournament: HistoryRow }) {
  if (!tournament.place) return <>-</>;
  return (
    <>
      {tournament.place}
      {tournament.trophyPlace ? (
        <span className="ml-1.5 rounded-full bg-[#FFF4E5] px-2 py-0.5 text-xs font-semibold text-[#B54708]">
          Trophy
        </span>
      ) : null}
    </>
  );
}

/** Until the results are published there is nothing behind this, so it says so. */
const pointsLabel = (tournament: HistoryRow) =>
  tournament.hasResult ? `${tournament.points ?? "-"} pts` : "Awaiting results";

export default function MyHistory() {
  const { tournaments, page, totalPages, setPage, backHref, isPending } =
    useMyHistory();

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-12 pt-4 md:px-6 md:pt-8 lg:px-0">
      <Link
        href={backHref}
        className="mb-2 inline-flex min-h-11 items-center gap-2 pr-3 text-base font-medium leading-6 text-[#083F92] md:mb-3 md:gap-3 md:text-lg"
      >
        <BackIcon className="h-5 w-3 md:h-[27px] md:w-[15px]" />
        Back
      </Link>

      <h1 className="mb-2 text-3xl font-bold leading-10 text-[#083F92] md:mb-3 md:text-[45px] md:leading-[61px]">
        My History
      </h1>
      <p className="mb-5 text-base leading-6 text-[#151515] md:mb-6 md:text-[22px] md:leading-[30px]">
        View your past tournaments and performance.
      </p>

      {/* md and up: the table */}
      <div className="hidden overflow-x-auto bg-white md:block">
        <div className="min-w-[900px]">
          <div
            className={`${GRID_COLS} rounded-t-[12px] bg-[#083F92] px-6 py-3 text-base font-medium leading-[22px] text-white`}
          >
            <span>Tournaments</span>
            <span>Date</span>
            <span>Month</span>
            <span>Year</span>
            <span>Rating</span>
            <span>Place</span>
            <span>Points</span>
          </div>

          {isPending ? (
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`${GRID_COLS} items-center border-b border-[#DADADA] px-6 py-[11px]`}
              >
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>
                <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200"></div>
                <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200"></div>
                <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200"></div>
                <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200"></div>
                <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200"></div>
                <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200"></div>
              </div>
            ))
          ) : tournaments.length > 0 ? (
            tournaments.map((tournament: HistoryRow, index: number) => (
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
                <span>
                  <Place tournament={tournament} />
                </span>
                <span className="text-left font-semibold">
                  {pointsLabel(tournament)}
                </span>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-[#727272]">
              No tournament history found.
            </div>
          )}
        </div>
      </div>

      {/* phone: one card per tournament */}
      <div className="md:hidden">
        {isPending ? (
          <div className="flex flex-col gap-3" aria-busy="true">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="flex flex-col gap-3 rounded-2xl p-4 shadow-none">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </Card>
            ))}
          </div>
        ) : tournaments.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {tournaments.map((tournament: HistoryRow) => (
              <li key={tournament.id}>
                <Card className="rounded-2xl border-[#E4E4EC] p-4 shadow-none">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words text-base font-semibold leading-5 text-[#181818]">
                        {tournament.name}
                      </p>
                      <p className="mt-1 text-xs text-[#636363]">
                        {tournament.date} {tournament.month} {tournament.year}
                      </p>
                    </div>
                    {tournament.trophyPlace ? (
                      <Badge className="shrink-0 bg-[#FFF4E5] text-[#B54708]">
                        Trophy
                      </Badge>
                    ) : null}
                  </div>

                  <dl className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-[#F7F6FF] px-2 py-3 text-center">
                    <div>
                      <dt className="text-[11px] text-[#636363]">Rating</dt>
                      <dd className="text-sm font-semibold text-[#083F92]">
                        {tournament.rating}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-[#636363]">Place</dt>
                      <dd className="text-sm font-semibold text-[#083F92]">
                        {tournament.place ?? "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-[#636363]">Points</dt>
                      <dd className="text-sm font-semibold text-[#083F92]">
                        {pointsLabel(tournament)}
                      </dd>
                    </div>
                  </dl>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center text-sm text-[#727272]">
            No tournament history found.
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="hidden text-base leading-6 text-[#083F92] md:block">
          You are on page {page} of {totalPages} {totalPages === 1 ? "Page" : "Pages"}
        </p>
        <CustomPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
