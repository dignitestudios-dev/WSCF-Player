"use client";

import { useMemo } from "react";
import { getTournamentDetailsRoute } from "@/config/routes";
import { getTournamentById } from "@/features/tournaments/data/tournaments";

export function useTournamentRegisteredPlayers(tournamentId: string) {
  const tournament = useMemo(() => getTournamentById(tournamentId), [tournamentId]);
  const backHref = getTournamentDetailsRoute(tournamentId);

  return {
    tournament,
    players: tournament?.players ?? [],
    backHref,
  };
}
