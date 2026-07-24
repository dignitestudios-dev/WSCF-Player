"use client";

import { useState } from "react";
import { DEFAULT_REDIRECT } from "@/config/routes";
import { useAuthUserQuery } from "@/features/auth/api/auth.queries";
import { useUserTournamentHistoryQuery } from "@/features/players/api/players.queries";

const PAGE_SIZE = 10;

function getOrdinalSuffix(i: number) {
  const j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
}

export function useMyHistory() {
  const [page, setPage] = useState(1);
  const { data: authData } = useAuthUserQuery();
  const userId = authData?.data?.user?._id;

  const { data, isPending } = useUserTournamentHistoryQuery(
    userId as string,
    { page, limit: PAGE_SIZE, status: "completed" }

  );

  const history = data?.data?.history || [];
  const pagination = data?.pagination;

  const mappedTournaments = history.map((t: any) => {
    const d = t.tournament?.date ? new Date(t.tournament.date) : null;
    return {
      id: t._id || Math.random().toString(),
      name: t.tournament?.title || "Unknown",
      date: d ? `${d.getDate()}${getOrdinalSuffix(d.getDate())}` : "-",
      month: d ? d.toLocaleString("default", { month: "long" }) : "-",
      year: d ? d.getFullYear().toString() : "-",
      rating: t.rating || "-",
      ratingChange: t.ratingChange || "-",
    };
  });

  return {
    tournaments: mappedTournaments,
    page: pagination?.currentPage || 1,
    totalPages: pagination?.totalPages || 1,
    totalItems: pagination?.totalItems || 0,
    pageSize: PAGE_SIZE,
    setPage,
    backHref: DEFAULT_REDIRECT,
    isPending
  };
}
