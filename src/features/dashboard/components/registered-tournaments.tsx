"use client";

import Link from "next/link";
import { getTournamentDetailsRoute } from "@/config/routes";
import { useRegisteredTournaments } from "@/features/dashboard/hooks/use-registered-tournaments";
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

function ChessIcon({ className }: { className?: string }) {
  return (
    <svg width="29" height="29" viewBox="0 0 29 29" fill="none" aria-hidden="true" className={className}>
      <path
        d="M14.5 3C11.5 3 9.5 5.5 9.5 8.5C9.5 10.5 10.5 12 12 13L10.5 18H18.5L17 13C18.5 12 19.5 10.5 19.5 8.5C19.5 5.5 17.5 3 14.5 3Z"
        fill="currentColor"
      />
      <path d="M8 18H21V21C21 23 19.5 24.5 17.5 24.5H11.5C9.5 24.5 8 23 8 21V18Z" fill="currentColor" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2C7.25 2 5 4.25 5 7C5 10.75 10 17 10 17C10 17 15 10.75 15 7C15 4.25 12.75 2 10 2Z"
        fill="#083F92"
      />
      <circle cx="10" cy="7" r="2" fill="white" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="14" height="13" rx="2" fill="#083F92" />
      <rect x="3" y="4" width="14" height="4" rx="2" fill="#083F92" />
      <rect x="6" y="2" width="2" height="4" fill="#083F92" />
      <rect x="12" y="2" width="2" height="4" fill="#083F92" />
    </svg>
  );
}

function DivisionIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3L3 7L10 11L17 7L10 3Z" fill="#083F92" />
      <path d="M3 11L10 15L17 11" stroke="#083F92" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 14.5L10 18.5L17 14.5" stroke="#083F92" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RegisteredTournamentCard({ tournament }: { tournament: RegisteredTournament }) {
  return (
    <div className="relative group flex min-h-[108px] items-center rounded-[12px] border border-[#083F92] bg-white px-8 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-colors hover:bg-gray-50 cursor-pointer">
      <Link href={getTournamentDetailsRoute(tournament.id, "registered")} className="absolute inset-0 z-0" aria-label={`View details for ${tournament.title}`} />
      <div className="relative z-10 flex h-[53px] w-[53px] shrink-0 items-center justify-center rounded-full bg-[#083F92] pointer-events-none">
        <ChessIcon className="text-white" />
      </div>

      <div className="relative z-10 ml-4 min-w-0 flex-1 pr-36 sm:pr-44 pointer-events-none">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold leading-6 text-[#083F92] group-hover:underline">{tournament.title}</h3>
          {tournament.paymentStatus === "pending" && (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
              Not Paid
            </span>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {tournament.divisionLabel && tournament.divisionLabel !== "-" && (
            <div className="flex items-center gap-1.5 mr-2">
              <DivisionIcon />
              <span className="text-sm font-medium leading-[19px] text-[#151515]">{tournament.divisionLabel}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 mr-2">
            <LocationIcon />
            <span className="text-sm font-medium leading-[19px] text-[#151515]">{tournament.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarIcon />
            <span className="text-sm font-medium leading-[19px] text-[#151515]">{tournament.date}</span>
          </div>
        </div>
      </div>

      <Link
        href={getTournamentDetailsRoute(tournament.id, "registered")}
        className="absolute right-8 top-1/2 z-10 flex h-12 w-[136px] -translate-y-1/2 items-center justify-center rounded-full bg-[#083F92] text-sm font-medium leading-[19px] text-white"
      >
        View Details
      </Link>
    </div>
  );
}

export default function RegisteredTournaments() {
  const { tournaments, isPending, setPage, pagination, backHref } = useRegisteredTournaments();

  return (
    <div className="mx-auto max-w-[1240px] px-6 pb-12 pt-8 lg:px-0">
      <Link
        href={backHref}
        className="mb-[27px] inline-flex items-center gap-3 text-lg font-medium leading-6 text-[#083F92]"
      >
        <BackIcon />
        Back
      </Link>

      <div className="rounded-[12px] bg-white p-8">
        <h1 className="text-[30px] font-bold leading-[41px] text-[#083F92]">
          Your Registered Tournaments ({pagination?.totalItems ?? tournaments.length})
        </h1>

        <div className="mt-[41px] flex flex-col gap-4">
          {isPending ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="relative flex min-h-[108px] items-center rounded-[12px] border border-[#083F92] bg-white px-8 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
              >
                <Skeleton className="h-[53px] w-[53px] shrink-0 rounded-full" />
                <div className="ml-4 min-w-0 flex-1 pr-36 sm:pr-44">
                  <Skeleton className="mb-2 h-6 w-64" />
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
                <Skeleton className="absolute right-8 top-1/2 h-12 w-[136px] -translate-y-1/2 rounded-full" />
              </div>
            ))
          ) : tournaments.length > 0 ? (
            tournaments.map((tournament) => (
              <RegisteredTournamentCard key={tournament.id} tournament={tournament} />
            ))
          ) : (
            <p className="text-center text-sm text-[#727272]">No registered tournaments found.</p>
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
    </div>
  );
}
