"use client";

import { useState, useEffect } from "react";
import { DEFAULT_REDIRECT } from "@/config/routes";
import { useUsersQuery } from "@/features/players/api/players.queries";

export function useDashboardPlayersRatingLookup() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  const { data, isPending } = useUsersQuery({
    page,
    limit: 10,
    search: debouncedQuery,
  });

  const apiUsers = data?.data?.users || [];
  const pagination = data?.data?.pagination;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredPlayers = apiUsers.map((user: any) => {
    const firstName = user.playerProfile?.firstName || user.firstName || "";
    const lastName = user.playerProfile?.lastName || user.lastName || "";
    const combinedName = [firstName, lastName].filter(Boolean).join(" ");
    
    return {
      id: user._id,
      name: combinedName || user.name || "Unknown Player",
      userId: user.playerProfile?.membershipId || user._id,
      rating: user.playerProfile?.rating || 0,
    };
  });

  return {
    query,
    setQuery,
    filteredPlayers,
    isPending,
    page,
    setPage,
    pagination,
    backHref: DEFAULT_REDIRECT,
  };
}
