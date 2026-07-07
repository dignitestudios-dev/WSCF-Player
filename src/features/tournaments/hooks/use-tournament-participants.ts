"use client";

import { useMemo, useState } from "react";
import {
  AUTH_REDIRECT,
  DEFAULT_REDIRECT,
  getTournamentDetailsRoute,
} from "@/config/routes";

const participants: TournamentParticipant[] = [
  {
    id: "1",
    userId: "00000001",
    name: "Ethan Carter",
    grade: "7th",
    rating: "5423",
    team: "Milwaukee Knights Chess Club",
    division: "X2",
  },
  {
    id: "2",
    userId: "00000002",
    name: "Olivia Brown",
    grade: "7th",
    rating: "5423",
    team: "Milwaukee Knights Chess Club",
    division: "X1",
    highlightName: true,
  },
  {
    id: "3",
    userId: "00000003",
    name: "Lucas White",
    grade: "7th",
    rating: "5423",
    team: "Milwaukee Knights Chess Club",
    division: "X3",
    highlightName: true,
  },
  {
    id: "4",
    userId: "00000004",
    name: "Sophia Green",
    grade: "7th",
    rating: "5423",
    team: "Milwaukee Knights Chess Club",
    division: "X3",
    highlightName: true,
  },
  {
    id: "5",
    userId: "00000005",
    name: "Mason Johnson",
    grade: "7th",
    rating: "5423",
    team: "Milwaukee Knights Chess Club",
    division: "X1",
    highlightName: true,
  },
  {
    id: "6",
    userId: "00000006",
    name: "Ava Martinez",
    grade: "7th",
    rating: "5423",
    team: "Milwaukee Knights Chess Club",
    division: "X1",
    highlightName: true,
  },
  {
    id: "7",
    userId: "00000007",
    name: "James Wilson",
    grade: "7th",
    rating: "5423",
    team: "Milwaukee Knights Chess Club",
    division: "X2",
    highlightName: true,
  },
  {
    id: "8",
    userId: "00000008",
    name: "Isabella Davis",
    grade: "7th",
    rating: "5423",
    team: "Milwaukee Knights Chess Club",
    division: "X2",
    highlightName: true,
  },
  {
    id: "9",
    userId: "00000009",
    name: "Liam Thompson",
    grade: "7th",
    rating: "5423",
    team: "Milwaukee Knights Chess Club",
    division: "X2",
    highlightName: true,
  },
];

const PAGE_SIZE = 9;

export function useTournamentParticipants(options?: {
  context?: "auth" | "dashboard";
  tournamentId?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const context = options?.context ?? "auth";
  const tournamentId = options?.tournamentId;

  const backHref =
    context === "dashboard"
      ? tournamentId
        ? getTournamentDetailsRoute(tournamentId)
        : DEFAULT_REDIRECT
      : AUTH_REDIRECT;

  const filteredParticipants = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return participants;

    return participants.filter(
      (participant) =>
        participant.name.toLowerCase().includes(normalized) ||
        participant.userId.includes(normalized) ||
        participant.team.toLowerCase().includes(normalized)
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filteredParticipants.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedParticipants = filteredParticipants.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return {
    query,
    setQuery,
    participants: paginatedParticipants,
    page: currentPage,
    totalPages,
    setPage,
    backHref,
    context,
  };
}
