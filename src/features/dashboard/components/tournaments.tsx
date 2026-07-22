"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getTournamentDetailsRoute } from "@/config/routes";
import type { DashboardTournament } from "@/features/dashboard/hooks/use-dashboard";
import TournamentRegistrationFlow from "@/features/tournaments/components/tournament-registration-flow";
import { useTournamentsQuery } from "@/features/tournaments/api/tournaments.queries";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { useAuthUserQuery } from "@/features/auth/api/auth.queries";
import MembershipRequiredDialog from "@/features/tournaments/components/membership-required-dialog";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="#083F92" strokeWidth="2" />
      <path d="M12.5 12.5L16 16" stroke="#083F92" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChessIcon() {
  return (
    <svg width="29" height="29" viewBox="0 0 29 29" fill="none" aria-hidden="true">
      <path
        d="M14.5 3C11.5 3 9.5 5.5 9.5 8.5C9.5 10.5 10.5 12 12 13L10.5 18H18.5L17 13C18.5 12 19.5 10.5 19.5 8.5C19.5 5.5 17.5 3 14.5 3Z"
        fill="white"
      />
      <path d="M8 18H21V21C21 23 19.5 24.5 17.5 24.5H11.5C9.5 24.5 8 23 8 21V18Z" fill="white" />
    </svg>
  );
}

function MetaItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-sm font-medium leading-[19px] text-[#151515]">{text}</span>
    </div>
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

function MoneyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" fill="#083F92" />
      <path
        d="M10 6V14M7.5 8.5C7.5 7.5 8.5 7 10 7C11.5 7 12.5 7.5 12.5 8.5C12.5 9.5 11.5 10 10 10C8.5 10 7.5 10.5 7.5 11.5C7.5 12.5 8.5 13 10 13C11.5 13 12.5 12.5 12.5 11.5"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TournamentCard({
  tournament,
  onRegister,
}: {
  tournament: DashboardTournament;
  onRegister: (tournament: DashboardTournament) => void;
}) {
  return (
    <div className="relative h-[108px] rounded-[12px] border border-[#083F92] bg-white p-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
      <div className="flex items-start gap-6 pr-40">
        <div className="flex h-[53px] w-[53px] shrink-0 items-center justify-center rounded-full bg-[#083F92]">
          <ChessIcon />
        </div>
        <div className="min-w-0">
          <Link href={getTournamentDetailsRoute(tournament.id, "dashboard")}>
            <h3 className="truncate text-lg font-bold leading-6 text-[#083F92] hover:underline">
              {tournament.title}
            </h3>
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <MetaItem icon={<LocationIcon />} text={tournament.location} />
            <MetaItem icon={<CalendarIcon />} text={tournament.date} />
            <MetaItem icon={<MoneyIcon />} text={tournament.price} />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRegister(tournament)}
        className="absolute right-6 top-1/2 h-12 w-[136px] -translate-y-1/2 rounded-full bg-[#083F92] text-xs font-medium text-white"
      >
        Register Now
      </button>
    </div>
  );
}

export default function Tournaments() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [registrationTournament, setRegistrationTournament] = useState<DashboardTournament | null>(null);
  const [isMembershipRequiredOpen, setIsMembershipRequiredOpen] = useState(false);
  const { data: authData } = useAuthUserQuery();

  function handleRegisterClick(tournament: DashboardTournament) {
    if (authData?.data?.membership?.status !== "active") {
      setIsMembershipRequiredOpen(true);
      return;
    }
    setRegistrationTournament(tournament);
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  const { data, isPending } = useTournamentsQuery({
    page,
    limit: 8,
    search: debouncedQuery,
  });

  const apiTournaments = data?.data.tournaments || [];
  const pagination = data?.pagination;

  const mappedTournaments: DashboardTournament[] = apiTournaments.map(t => ({
    id: t._id,
    title: t.title,
    location: t.location,
    date: new Date(t.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    price: t.entryFee === 0 ? "Free" : `$${t.entryFee}`,
  }));

  return (
    <>
      <div className="mx-auto max-w-[1240px] px-6 pb-12 pt-8 lg:px-0">
        <div className="mb-6 flex max-w-[736px] flex-col gap-3">
          <h1 className="text-[45px] font-bold leading-[61px] text-[#083F92]">Tournaments</h1>
          <p className="text-[22px] leading-[30px] text-[#151515]">
            Browse and register for upcoming tournaments.
          </p>
        </div>

        <div className="mb-8 flex h-[61px] max-w-[610px] items-center gap-3 rounded-[44px] border border-[#083F92] bg-white px-3">
          <SearchIcon />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tournaments by title, location, or date"
            className="w-full bg-transparent text-base font-medium text-[#151515] outline-none placeholder:text-[#ADADAD]"
          />
        </div>

        <div className="flex flex-col gap-4">
          {isPending ? (
            <>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="relative h-[108px] rounded-[12px] border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-6 pr-40">
                    <Skeleton className="h-[53px] w-[53px] shrink-0 rounded-full" />
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <Skeleton className="h-6 w-48 mb-4" />
                      <div className="flex flex-wrap items-center gap-2">
                        <Skeleton className="h-[19px] w-24" />
                        <Skeleton className="h-[19px] w-24" />
                        <Skeleton className="h-[19px] w-24" />
                      </div>
                    </div>
                  </div>
                  <Skeleton className="absolute right-6 top-1/2 h-12 w-[136px] -translate-y-1/2 rounded-full" />
                </div>
              ))}
            </>
          ) : mappedTournaments.length === 0 ? (
            <p className="text-[#727272]">No tournaments found.</p>
          ) : (
            mappedTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onRegister={handleRegisterClick}
              />
            ))
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

      {registrationTournament ? (
        <TournamentRegistrationFlow
          tournament={registrationTournament}
          onClose={() => setRegistrationTournament(null)}
        />
      ) : null}

      <MembershipRequiredDialog 
        open={isMembershipRequiredOpen} 
        onOpenChange={setIsMembershipRequiredOpen} 
      />
    </>
  );
}
