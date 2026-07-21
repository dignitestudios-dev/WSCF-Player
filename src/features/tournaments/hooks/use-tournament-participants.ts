"use client";

import { useState, useEffect } from "react";
import {
  AUTH_REDIRECT,
  DEFAULT_REDIRECT,
  getTournamentDetailsRoute,
} from "@/config/routes";
import { useTournamentParticipantsQuery } from "@/features/tournaments/api/tournaments.queries";

export function useTournamentParticipants(options?: {
  context?: "auth" | "dashboard";
  tournamentId?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  const context = options?.context ?? "auth";
  const tournamentId = options?.tournamentId;

  const backHref =
    context === "dashboard"
      ? tournamentId
        ? getTournamentDetailsRoute(tournamentId)
        : DEFAULT_REDIRECT
      : AUTH_REDIRECT;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const { data, isPending, isError } = useTournamentParticipantsQuery(
    tournamentId || "",
    {
      page,
      limit: 10,
      search: debouncedQuery,
    }
  );

  const apiParticipants = data?.data?.participants || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const currentPage = pagination?.currentPage || 1;

  const formattedParticipants = apiParticipants.map((p: any) => ({
    id: p.user?._id || p._id,
    userId: p.playerProfile?.membershipId || p.user?._id || "-",
    name: p.user?.name || "-",
    grade: p.playerProfile?.grade || "-",
    rating: p.playerProfile?.rating || "-",
    team: p.team?.name || "-",
    division: p.playerProfile?.division || "-", // Assuming division might be here if applicable
    highlightName: false,
  }));

  return {
    query,
    setQuery,
    participants: formattedParticipants,
    page: currentPage,
    totalPages,
    setPage,
    backHref,
    context,
    isPending,
    isError,
  };
}
