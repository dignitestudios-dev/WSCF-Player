"use client";

import { useState } from "react";
import { AUTH_REDIRECT } from "@/config/routes";
import { players } from "@/features/players/data/players";

export function usePlayersRatingLookup() {
  const [query, setQuery] = useState("");

  const normalized = query.trim().toLowerCase();
  const filteredPlayers = !normalized
    ? players.slice(0, 3)
    : players.filter(
        (player) =>
          player.name.toLowerCase().includes(normalized) || player.userId.toLowerCase().includes(normalized)
      );

  return {
    query,
    setQuery,
    filteredPlayers,
    backHref: AUTH_REDIRECT,
  };
}
