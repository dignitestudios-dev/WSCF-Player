"use client";

import { useState, useEffect } from "react";
import { AUTH_REDIRECT } from "@/config/routes";
import { useUsersQuery } from "@/features/players/api/players.queries";

export function usePlayersRatingLookup() {
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
    // GET /user returns the player row flat — firstName, rating and
    // membershipId sit at the top level, not under a `playerProfile` key.
    // Reading a nested one silently produced "Rating: 0" for everybody.
    const combinedName = [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ");

    return {
      id: user._id,
      name: combinedName || user.name || "Unknown Player",
      userId: user.membershipId || user._id,
      rating: user.rating ?? 0,
      team: user.team?.name || "",
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
    backHref: AUTH_REDIRECT,
  };
}
