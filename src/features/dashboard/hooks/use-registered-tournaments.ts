"use client";

import { useState } from "react";
import { DEFAULT_REDIRECT } from "@/config/routes";
import { useMyTournamentsQuery } from "@/features/tournaments/api/tournaments.queries";

export function useRegisteredTournaments() {
  const [page, setPage] = useState(1);

  const { data, isPending } = useMyTournamentsQuery({
    page,
    limit: 10,
  });

  const registrations = data?.data?.registrations || [];
  const pagination = data?.pagination;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tournaments: RegisteredTournament[] = registrations.map((reg: any) => ({
    id: reg.tournament._id,
    title: reg.tournament.title,
    location: reg.tournament.location,
    date: new Date(reg.tournament.date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }),
    paymentStatus: reg.paymentStatus,
    divisionLabel: reg.division?.label || "-",
  }));

  return {
    tournaments,
    isPending,
    page,
    setPage,
    pagination,
    backHref: DEFAULT_REDIRECT,
  };
}
