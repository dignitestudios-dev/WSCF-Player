"use client";

import { useParams, usePathname } from "next/navigation";
import { DASHBOARD_PLAYERS_RATING_ROUTE, PLAYERS_RATING_ROUTE } from "@/config/routes";
import { players } from "@/features/players/data/players";

export function usePlayerProfile() {
  const params = useParams();
  const pathname = usePathname();
  const playerId = params.id as string;
  const fromDashboard = pathname.startsWith("/dashboard/player-profile");

  const player =
    players.find((item) => item.id === playerId) ??
    ({
      ...players[0],
      id: playerId,
      name: "Alan Harrison",
    } satisfies PlayerProfile);

  return {
    player,
    backHref: fromDashboard ? DASHBOARD_PLAYERS_RATING_ROUTE : PLAYERS_RATING_ROUTE,
  };
}
