"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DASHBOARD_PLAYERS_RATING_ROUTE,
  DASHBOARD_TOURNAMENTS_ROUTE,
  REGISTERED_TOURNAMENTS_ROUTE,
} from "@/config/routes";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import type { DashboardTournament } from "@/features/dashboard/hooks/use-dashboard";
import TournamentCard from "@/features/tournaments/components/tournament-card";
import TournamentRegistrationFlow from "@/features/tournaments/components/tournament-registration-flow";
import { useTournamentsQuery } from "@/features/tournaments/api/tournaments.queries";
import { useAuthUserQuery } from "@/features/auth/api/auth.queries";
import { Skeleton } from "@/components/ui/skeleton";
import RenewMembershipConfirmModal from "@/features/dashboard/components/renew-membership-confirm-modal";
import MembershipRequiredDialog from "@/features/tournaments/components/membership-required-dialog";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="#083F92" strokeWidth="2" />
      <path d="M12.5 12.5L16 16" stroke="#083F92" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function DashboardOverview() {
  const { summary, isLoading: isSummaryLoading } = useDashboard();
  const { data: tournamentsData, isPending } = useTournamentsQuery({
    page: 1,
    limit: 4,
    status: "upcoming",
  });
  const [registrationTournament, setRegistrationTournament] = useState<DashboardTournament | null>(null);
  const [isRenewMembershipOpen, setIsRenewMembershipOpen] = useState(false);
  const [isMembershipRequiredOpen, setIsMembershipRequiredOpen] = useState(false);

  const mappedTournaments: DashboardTournament[] = (tournamentsData?.data.tournaments || []).map(t => ({
    id: t._id,
    title: t.title,
    location: t.location,
    date: new Date(t.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    price: t.entryFee === 0 ? "Free" : `$${t.entryFee.toFixed(2)}`,
    divisions: t.divisions || [],
  }));

  const { data: authData } = useAuthUserQuery();

  function handleRegisterClick(tournament: DashboardTournament) {
    if (authData?.data?.membership?.status !== "active") {
      setIsMembershipRequiredOpen(true);
      return;
    }
    setRegistrationTournament(tournament);
  }

  return (
    <>
    <div className="mx-auto max-w-[1240px] px-6 pb-12 pt-8 lg:px-0">
      <div className="mb-8 flex max-w-[736px] flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[32px] font-bold leading-[44px] text-[#083F92] lg:text-[45px] lg:leading-[61px]">
            Welcome Back
          </h1>
          <p className="text-lg leading-[30px] text-[#727272] lg:text-[22px]">
            Here&apos;s what&apos;s happening with your chess journey.
          </p>
        </div>

        <Link
          href={DASHBOARD_PLAYERS_RATING_ROUTE}
          className="flex h-[61px] items-center gap-3 rounded-[44px] border border-[#083F92] bg-white px-4 transition hover:bg-[#F7F6FF]"
        >
          <SearchIcon />
          <span className="min-w-0 flex-1 text-base font-medium text-[#ADADAD]">
            Search and view player ratings by name or a USER ID
          </span>
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-[26px] xl:grid-cols-3">
        <div className="relative overflow-hidden rounded-[12px] bg-[#083F92] p-4">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex flex-col gap-2.5">
              <h2 className="text-[22px] font-semibold leading-[30px] text-white">Membership Status</h2>
              {isSummaryLoading ? (
                <Skeleton className="h-[36px] w-[82px] rounded-full bg-white/40" />
              ) : (
                <div className="flex flex-col gap-2">
                  <span className="inline-flex w-fit rounded-full bg-white px-3 py-2 text-sm font-medium capitalize text-[#083F92]">
                    {summary.membershipStatus}
                  </span>
                  {summary.membershipStatus !== "Active" && (
                    <button
                      type="button"
                      onClick={() => setIsRenewMembershipOpen(true)}
                      className="mt-1 w-fit rounded-full border border-white px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      {/* Someone who has never joined is not renewing. */}
                      {summary.hasMembership
                        ? "Renew Membership"
                        : "Become a Member"}
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xl leading-[27px] text-[#DFEBF9]">Valid Till</span>
              {isSummaryLoading ? (
                <Skeleton className="h-[30px] w-32 bg-white/40" />
              ) : (
                <span className="text-[22px] leading-[30px] text-white">{summary.validTill}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xl leading-[27px] text-[#DFEBF9]">USER ID</span>
              {isSummaryLoading ? (
                <Skeleton className="h-[30px] w-24 bg-white/40" />
              ) : (
                <span className="text-[22px] leading-[30px] text-white">{summary.userId}</span>
              )}
            </div>
          </div>
          <div className="pointer-events-none absolute -right-8 top-8 opacity-50">
            <Image src="/images/homepage.png" alt="" width={180} height={180} className="rotate-[-14deg]" />
          </div>
        </div>

        <div className="rounded-[24px] border border-[#083F92] bg-white p-[22px]">
          <h2 className="text-[22px] font-semibold leading-[30px] text-[#083F92]">Current Rating</h2>
          {isSummaryLoading ? (
            <Skeleton className="mt-2 h-[54px] w-24" />
          ) : (
            <p className="mt-2 text-[40px] font-semibold leading-[54px] text-[#083F92]">{summary.currentRating}</p>
          )}
          <div className="mt-6 flex flex-col gap-3">
            {isSummaryLoading ? (
              <Skeleton className="h-[27px] w-32" />
            ) : (
              <span className="text-xl leading-[27px] text-[#727272]">{summary.lastUpdate}</span>
            )}
            <span className="text-[22px] font-bold leading-[30px] text-[#083F92]">Last Update</span>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#083F92] bg-white p-[22px]">
          <h2 className="text-[22px] font-semibold leading-[30px] text-[#083F92]">Upcoming Tournaments</h2>
          {isSummaryLoading ? (
            <Skeleton className="mt-2 h-[54px] w-16" />
          ) : (
            <p className="mt-2 text-[40px] font-semibold leading-[54px] text-[#083F92]">{summary.upcomingCount}</p>
          )}
          <div className="mt-6 flex flex-col justify-between gap-4">
            {isSummaryLoading ? (
              <Skeleton className="h-[80px] w-full" />
            ) : (
              <p className="text-[20px] lg:text-[22px] h-[80px] font-medium leading-[30px] text-[#083F92]">
                {summary.nextTournamentAt 
                  ? `Your next tournament is scheduled on ${summary.nextTournamentAt}.` 
                  : "You have no upcoming tournaments scheduled."}
              </p>
            )}
            <Link href={REGISTERED_TOURNAMENTS_ROUTE} className="self-end text-sm font-medium text-[#083F92]">
              View Details
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#083F92] bg-white p-4 lg:p-6">
        <h2 className="mb-6 text-[22px] font-semibold leading-[30px] text-[#083F92]">
          Upcoming Tournaments
        </h2>

        <div className="flex max-h-[646px] flex-col gap-4 overflow-y-auto pr-1">
          {isPending ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="relative rounded-[12px] border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 pr-44 sm:pr-52">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-[53px] w-[53px] shrink-0 rounded-full" />
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <Skeleton className="h-6 w-48 mb-4" />
                        <div className="flex flex-wrap items-center gap-4">
                          <Skeleton className="h-[19px] w-24" />
                          <Skeleton className="h-[19px] w-24" />
                          <Skeleton className="h-[19px] w-24" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Skeleton className="absolute right-6 top-1/2 h-14 w-[136px] -translate-y-1/2 rounded-full px-8" />
                </div>
              ))}
            </>
          ) : mappedTournaments.length === 0 ? (
            <p className="text-sm text-[#727272]">No upcoming tournaments found.</p>
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

        {mappedTournaments.length > 0 && (
          <div className="mt-6 flex justify-end">
            <Link href={DASHBOARD_TOURNAMENTS_ROUTE} className="text-lg font-medium text-[#083F92]">
              View All
            </Link>
          </div>
        )}
      </div>
    </div>

      {registrationTournament ? (
        <TournamentRegistrationFlow
          tournament={registrationTournament}
          onClose={() => setRegistrationTournament(null)}
        />
      ) : null}
      
      {isRenewMembershipOpen ? (
        <RenewMembershipConfirmModal
          hasMembership={summary.hasMembership}
          onClose={() => setIsRenewMembershipOpen(false)}
        />
      ) : null}

      <MembershipRequiredDialog 
        open={isMembershipRequiredOpen} 
        onOpenChange={setIsMembershipRequiredOpen} 
      />
    </>
  );
}
