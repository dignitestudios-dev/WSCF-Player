"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  DEFAULT_REDIRECT,
  REGISTERED_TOURNAMENTS_ROUTE,
} from "@/config/routes";
import { getTournamentById } from "@/features/tournaments/data/tournaments";

const PREVIEW_COUNT = 10;

export function useTournamentDetails(tournamentId: string) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const tournament = useMemo(() => getTournamentById(tournamentId), [tournamentId]);

  const backHref = from === "dashboard" ? DEFAULT_REDIRECT : REGISTERED_TOURNAMENTS_ROUTE;
  const previewPlayers = tournament?.players.slice(0, PREVIEW_COUNT) ?? [];

  return {
    tournament,
    previewPlayers,
    backHref,
    showViewAll: (tournament?.players.length ?? 0) > PREVIEW_COUNT,
  };
}
