"use client";

import { useState } from "react";
import { DEFAULT_REDIRECT } from "@/config/routes";
import { players } from "@/features/players/data/players";

export function useDashboardPlayersRatingLookup() {
  const [query, setQuery] = useState("");

  const normalized = query.trim().toLowerCase();
  const filteredPlayers = !normalized
    ? players.slice(0, 5)
    : players.filter(
        (player) =>
          player.name.toLowerCase().includes(normalized) ||
          player.userId.toLowerCase().includes(normalized)
      );

  return {
    query,
    setQuery,
    filteredPlayers,
    backHref: DEFAULT_REDIRECT,
  };
}
