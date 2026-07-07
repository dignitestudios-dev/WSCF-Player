"use client";

import { useMemo, useState } from "react";
import { DEFAULT_REDIRECT } from "@/config/routes";

const tournaments: HistoryTournament[] = [
  { id: "1", name: "Spiring Bilts Arena", date: "12th", month: "June", year: "2026", rating: "#2", ratingChange: "+32" },
  { id: "2", name: "Clash Championship", date: "13th", month: "June", year: "2026", rating: "#2", ratingChange: "+32" },
  { id: "3", name: "Arena Tournament", date: "14th", month: "June", year: "2026", rating: "#2", ratingChange: "+32" },
  { id: "4", name: "Blitz Battle", date: "15th", month: "June", year: "2026", rating: "#2", ratingChange: "+32" },
  { id: "5", name: "Elite Rapid Cup", date: "15th", month: "June", year: "2026", rating: "#2", ratingChange: "+32" },
  { id: "6", name: "Kings Chess League", date: "16th", month: "June", year: "2025", rating: "#2", ratingChange: "+32" },
  { id: "7", name: "Pro Arena Showdown", date: "17th", month: "June", year: "2025", rating: "#2", ratingChange: "+32" },
  { id: "8", name: "Mastermind Chess", date: "19th", month: "June", year: "2025", rating: "#2", ratingChange: "+32" },
  { id: "9", name: "Royal Gambit", date: "20th", month: "June", year: "2025", rating: "#2", ratingChange: "+32" },
  { id: "10", name: "Spring Open Classic", date: "21st", month: "June", year: "2025", rating: "#3", ratingChange: "+28" },
  { id: "11", name: "Winter Blitz Cup", date: "5th", month: "January", year: "2025", rating: "#4", ratingChange: "+20" },
  { id: "12", name: "National Scholastic", date: "10th", month: "March", year: "2025", rating: "#2", ratingChange: "+35" },
  { id: "13", name: "City Rapid Open", date: "8th", month: "April", year: "2025", rating: "#1", ratingChange: "+40" },
  { id: "14", name: "Junior Masters", date: "12th", month: "May", year: "2025", rating: "#2", ratingChange: "+30" },
  { id: "15", name: "Summer Classic", date: "18th", month: "July", year: "2025", rating: "#3", ratingChange: "+25" },
  { id: "16", name: "Autumn Arena", date: "22nd", month: "September", year: "2025", rating: "#2", ratingChange: "+32" },
  { id: "17", name: "Holiday Blitz", date: "3rd", month: "December", year: "2024", rating: "#5", ratingChange: "+15" },
  { id: "18", name: "Regional Championship", date: "14th", month: "October", year: "2024", rating: "#2", ratingChange: "+32" },
  { id: "19", name: "State Finals", date: "6th", month: "November", year: "2024", rating: "#1", ratingChange: "+45" },
  { id: "20", name: "Club Championship", date: "9th", month: "August", year: "2024", rating: "#3", ratingChange: "+22" },
  { id: "21", name: "Memorial Open", date: "11th", month: "February", year: "2024", rating: "#4", ratingChange: "+18" },
  { id: "22", name: "Spring Invitational", date: "16th", month: "April", year: "2024", rating: "#2", ratingChange: "+32" },
  { id: "23", name: "Elite Qualifier", date: "20th", month: "June", year: "2024", rating: "#2", ratingChange: "+32" },
  { id: "24", name: "Grand Prix Final", date: "25th", month: "June", year: "2024", rating: "#1", ratingChange: "+50" },
];

const PAGE_SIZE = 10;

export function useMyHistory() {
  const [page, setPage] = useState(2);

  const totalPages = Math.ceil(tournaments.length / PAGE_SIZE);
  const paginatedTournaments = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return tournaments.slice(start, start + PAGE_SIZE);
  }, [page]);

  return {
    tournaments: paginatedTournaments,
    page,
    totalPages,
    totalItems: tournaments.length,
    pageSize: PAGE_SIZE,
    setPage,
    backHref: DEFAULT_REDIRECT,
  };
}
