"use client";

import Link from "next/link";
import LoginShell from "@/features/auth/components/login-shell";
import { usePlayersRatingLookup } from "@/features/auth/hooks/use-players-rating-lookup";
import { getPlayerProfileRoute } from "@/config/routes";

function CrossIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="#EE3131"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="#083F92" strokeWidth="2" />
      <path d="M12.5 12.5L16 16" stroke="#083F92" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function PlayersRatingLookup() {
  const { query, setQuery, filteredPlayers, backHref } = usePlayersRatingLookup();

  return (
    <LoginShell
      contentMaxWidth="max-w-[820px]"
      contentClassName="justify-start pt-16 lg:pt-0"
      hideLogo
    >
      <div className="flex w-full flex-col gap-4">
        <div className="flex h-[70px] w-full items-center justify-between gap-4 rounded-[24px] border border-[#3D3775] bg-white px-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link href={backHref} aria-label="Back" className="shrink-0">
              <CrossIcon />
            </Link>
            <div className="h-[15px] shrink-0 border-l-2 border-[#083F92]" />
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <SearchIcon />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search players rating"
                className="min-w-0 flex-1 bg-transparent text-base font-medium text-[#151515] outline-none placeholder:text-[#151515]"
              />
            </div>
          </div>
          <button
            type="button"
            className="h-[42px] shrink-0 rounded-full bg-[#083F92] px-5 text-base font-medium text-white"
          >
            Search
          </button>
        </div>

        <div className="overflow-hidden rounded-[12px] border border-[#DADADA] bg-white">
          {filteredPlayers.map((player, index) => (
            <Link
              key={player.id}
              href={getPlayerProfileRoute(player.id)}
              className={`flex min-h-[68px] items-center justify-between gap-4 px-5 py-3 transition hover:bg-[#F7F6FF] ${
                index % 2 === 1 ? "bg-white/50" : "bg-white"
              }`}
            >
              <div className="min-w-0">
                <p className="truncate text-base font-medium text-[#151515]">{player.name}</p>
                <p className="mt-1 text-sm text-[#727272]">USER ID: {player.userId}</p>
              </div>
              <span className="shrink-0 text-sm font-medium text-[#083F92]">View Profile</span>
            </Link>
          ))}
        </div>
      </div>
    </LoginShell>
  );
}
