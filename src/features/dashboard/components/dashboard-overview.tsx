"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DASHBOARD_PLAYERS_RATING_ROUTE,
  DASHBOARD_TOURNAMENTS_ROUTE,
  getTournamentDetailsRoute,
  REGISTERED_TOURNAMENTS_ROUTE,
} from "@/config/routes";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import type { DashboardTournament } from "@/features/dashboard/hooks/use-dashboard";
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

function MetaItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 ">
      {icon}
      <span className="text-sm font-medium line-clamp-1 text-[#151515]">{label}</span>
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
    <div className="relative group overflow-hidden  rounded-[12px] h-[110px] border border-[#083F92] bg-white p-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-colors hover:bg-gray-50 cursor-pointer">
      <Link href={getTournamentDetailsRoute(tournament.id, "dashboard")} className="text-wrap break-word line-clamp-1 absolute inset-0 z-0" aria-label={`View details for ${tournament.title}`} />
      <div className="relative z-10 flex flex-col gap-4 pr-44 sm:pr-52 pointer-events-none">
        <div className="flex items-start gap-4">
          <div className="flex h-[53px] w-[53px] shrink-0 items-center justify-center rounded-full bg-[#083F92]">
            <ChessIcon className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg break-word line-clamp-1 font-bold leading-6 text-[#083F92] group-hover:underline">{tournament.title}</h3>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="w-[50%] line-clamp-1" >
              <MetaItem icon={<LocationIcon />} label={tournament.location} />
              </div><MetaItem icon={<CalendarIcon />} label={tournament.date} />
              <MetaItem icon={<MoneyIcon />} label={tournament.price} />
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRegister(tournament)}
        className="absolute right-6 top-1/2 z-10 h-14 -translate-y-1/2 rounded-full bg-[#083F92] px-8 text-base font-semibold text-white shadow-[0px_4px_4px_rgba(6,62,145,0.25)]"
      >
        Register Now
      </button>
    </div>
  );
}

export default function DashboardOverview() {
  const { summary, isLoading: isSummaryLoading } = useDashboard();
  const { data: tournamentsData, isPending } = useTournamentsQuery({ page: 1, limit: 4 });
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
                  {summary.membershipStatus === "Inactive" && (
                    <button
                      type="button"
                      onClick={() => setIsRenewMembershipOpen(true)}
                      className="mt-1 w-fit rounded-full border border-white px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Renew Membership
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
            <p className="text-[22px] h-[80px] font-medium leading-[30px] text-[#083F92]">
              {/* Your next tournaments are scheduled through Next Week. */}
            </p>
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
        <RenewMembershipConfirmModal onClose={() => setIsRenewMembershipOpen(false)} />
      ) : null}

      <MembershipRequiredDialog 
        open={isMembershipRequiredOpen} 
        onOpenChange={setIsMembershipRequiredOpen} 
      />
    </>
  );
}
