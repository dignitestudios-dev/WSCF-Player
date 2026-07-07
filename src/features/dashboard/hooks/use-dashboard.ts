"use client";

export interface DashboardSummary {
  membershipStatus: string;
  validTill: string;
  userId: string;
  currentRating: number;
  lastUpdate: string;
  upcomingCount: number;
}

export interface DashboardTournament {
  id: string;
  title: string;
  location: string;
  date: string;
  price: string;
}

const summary: DashboardSummary = {
  membershipStatus: "Active",
  validTill: "August 31, 2026",
  userId: "10000580",
  currentRating: 1650,
  lastUpdate: "10 May, 2026",
  upcomingCount: 2,
};

const tournaments: DashboardTournament[] = [
  {
    id: "1",
    title: "USCF-Rated Scholastic May Summer Tournament",
    location: "Old Guard Games",
    date: "June 20, 2026",
    price: "$10",
  },
  {
    id: "2",
    title: "USCF-Rated Scholastic May Summer Tournament",
    location: "Old Guard Games",
    date: "June 20, 2026",
    price: "$10",
  },
  {
    id: "3",
    title: "Wisconsin Spring Open Championship",
    location: "Old Guard Games",
    date: "July 12, 2026",
    price: "$10",
  },
  {
    id: "4",
    title: "Junior Rapid Chess Challenge",
    location: "Milwaukee Chess Center",
    date: "August 5, 2026",
    price: "$10",
  },
];

export function useDashboard() {
  return {
    summary,
    tournaments,
  };
}
