"use client";

import { useMemo, useState } from "react";
import type { DashboardTournament } from "@/features/dashboard/hooks/use-dashboard";
import TournamentCard from "@/features/tournaments/components/tournament-card";
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
    status: "upcoming",
  });

  const apiTournaments = data?.data.tournaments || [];
  const pagination = data?.pagination;

  const mappedTournaments: DashboardTournament[] = apiTournaments.map(t => ({
    id: t._id,
    title: t.title,
    location: t.location,
    date: new Date(t.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    price: t.entryFee === 0 ? "Free" : `$${t.entryFee.toFixed(2)}`,
    divisions: t.divisions || [],
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
