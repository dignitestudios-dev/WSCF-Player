"use client";

import Link from "next/link";
import { getDashboardPlayerProfileRoute } from "@/config/routes";
import { useTournamentRegisteredPlayers } from "@/features/tournaments/hooks/use-tournament-registered-players";

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

const GRID_COLS = "grid grid-cols-[126px_1.2fr_1fr_120px_120px]";

interface TournamentRegisteredPlayersProps {
  tournamentId: string;
}

export default function TournamentRegisteredPlayers({ tournamentId }: TournamentRegisteredPlayersProps) {
  const { tournament, players, backHref } = useTournamentRegisteredPlayers(tournamentId);

  if (!tournament) {
    return (
      <div className="mx-auto max-w-[1240px] px-6 pb-12 pt-8 lg:px-0">
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center gap-3 text-lg font-medium leading-6 text-[#083F92]"
        >
          <BackIcon />
          Back
        </Link>
        <p className="text-lg text-[#151515]">Tournament not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px] px-6 pb-12 pt-8 lg:px-0">
      <div className="mb-6 flex flex-col gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-3 text-lg font-medium leading-6 text-[#083F92]"
        >
          <BackIcon />
          Back
        </Link>
        <h1 className="text-[32px] font-bold leading-[44px] text-[#083F92] lg:text-[45px] lg:leading-[61px]">
          Registered Players
        </h1>
      </div>

      <div className="relative">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div
              className={`${GRID_COLS} h-[47px] items-center rounded-t-[12px] bg-[#083F92] px-5 text-base font-semibold text-white`}
            >
              <span>No</span>
              <span>Player</span>
              <span>USER ID</span>
              <span>Rating</span>
              <span className="text-right">Action</span>
            </div>

            {players.map((player, index) => (
              <div
                key={`${player.userId}-${index}`}
                className={`${GRID_COLS} h-[47px] items-center border-b border-[#DADADA] bg-white px-5 text-base font-medium text-[#151515] last:border-b-0`}
              >
                <span>{index + 1}</span>
                <span>{player.name}</span>
                <span>{player.userId}</span>
                <span>
                  <span className="inline-flex h-8 min-w-[78px] items-center justify-center rounded-[22px] bg-[#083F92] px-3 text-base font-medium text-white">
                    {player.rating}
                  </span>
                </span>
                <span className="text-right">
                  <Link
                    href={getDashboardPlayerProfileRoute(player.id)}
                    className="text-sm font-medium leading-[19px] text-[#151515] hover:text-[#083F92]"
                  >
                    View Profile
                  </Link>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <span className="inline-flex h-[35px] items-center justify-center rounded-full bg-[#181818] px-3 text-sm font-medium capitalize text-white">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
