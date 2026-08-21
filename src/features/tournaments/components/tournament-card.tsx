"use client";

import Link from "next/link";
import { getTournamentDetailsRoute } from "@/config/routes";
import type { DashboardTournament } from "@/features/dashboard/hooks/use-dashboard";

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

function MetaItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-sm font-medium leading-[19px] text-[#151515]">{label}</span>
    </div>
  );
}

interface TournamentCardProps {
  tournament: DashboardTournament;
  onRegister: (tournament: DashboardTournament) => void;
}

/**
 * The single tournament row used by both the dashboard overview and the
 * tournaments list. The whole card links to the details page; the Register
 * button sits above that link and handles its own click.
 */
export default function TournamentCard({ tournament, onRegister }: TournamentCardProps) {
  return (
    <div className="group relative h-[110px] overflow-hidden rounded-[12px] border border-[#083F92] bg-white p-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-colors hover:bg-gray-50 cursor-pointer">
      <Link
        href={getTournamentDetailsRoute(tournament.id, "dashboard")}
        className="absolute inset-0 z-0"
        aria-label={`View details for ${tournament.title}`}
      />
      <div className="pointer-events-none relative z-10 flex flex-col gap-4 pr-44 sm:pr-52">
        <div className="flex items-start gap-4">
          <div className="flex h-[53px] w-[53px] shrink-0 items-center justify-center rounded-full bg-[#083F92]">
            <ChessIcon />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 text-lg font-bold leading-6 break-words text-[#083F92] group-hover:underline">
              {tournament.title}
            </h3>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="line-clamp-1 w-[50%]">
                <MetaItem icon={<LocationIcon />} label={tournament.location} />
              </div>
              <MetaItem icon={<CalendarIcon />} label={tournament.date} />
              <MetaItem icon={<MoneyIcon />} label={tournament.price} />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRegister(tournament)}
        className="absolute right-6 top-1/2 z-10 h-14 -translate-y-1/2 rounded-full bg-[#083F92] px-8 text-base font-semibold text-white shadow-[0px_4px_4px_rgba(6,62,145,0.25)] transition-colors hover:bg-[#063875]"
      >
        Register Now
      </button>
    </div>
  );
}
