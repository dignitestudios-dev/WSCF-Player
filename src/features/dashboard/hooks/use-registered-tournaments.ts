"use client";

import { DEFAULT_REDIRECT } from "@/config/routes";

const tournaments: RegisteredTournament[] = [
  {
    id: "1",
    title: "USCF-Rated Scholastic May Summer Tournament",
    location: "Old Guard Games",
    date: "June 20, 2026",
  },
  {
    id: "2",
    title: "Professional Online Blitz Battle Championship",
    location: "Old Guard Games",
    date: "June 20, 2026",
  },
];

export function useRegisteredTournaments() {
  return {
    tournaments,
    backHref: DEFAULT_REDIRECT,
  };
}
