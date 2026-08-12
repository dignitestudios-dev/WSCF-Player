"use client";

import { useAuthUserQuery } from "@/features/auth/api/auth.queries";

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

const defaultTournaments: DashboardTournament[] = [
  {
    id: "1",
    title: "USCF-Rated Scholastic May Summer Tournament",
    location: "Old Guard Games",
    date: "June 20, 2026",
    price: "$10.00",
  },
  {
    id: "2",
    title: "USCF-Rated Scholastic May Summer Tournament",
    location: "Old Guard Games",
    date: "June 20, 2026",
    price: "$10.00",
  },
  {
    id: "3",
    title: "Wisconsin Spring Open Championship",
    location: "Old Guard Games",
    date: "July 12, 2026",
    price: "$10.00",
  },
  {
    id: "4",
    title: "Junior Rapid Chess Challenge",
    location: "Milwaukee Chess Center",
    date: "August 5, 2026",
    price: "$10.00",
  },
];

export function useDashboard() {
  const { data: authData, isLoading } = useAuthUserQuery();

  const user = authData?.data?.user;
  const membership = authData?.data?.membership;
  const profile = authData?.data?.playerProfile;
  const upcomingCount = authData?.data?.upcomingTournamentCount || 0;

  const validTillDate = membership?.currentPeriodEnd
    ? new Date(membership.currentPeriodEnd).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const lastUpdateDate = profile?.updatedAt
    ? new Date(profile.updatedAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const summary: DashboardSummary = {
    membershipStatus: membership?.status === "active" ? "Active" : "Inactive",
    validTill: validTillDate,
    userId: profile?.membershipId || user?._id || "N/A",
    currentRating: profile?.rating || 0,
    lastUpdate: lastUpdateDate,
    upcomingCount: upcomingCount,
  };

  return {
    summary,
    tournaments: defaultTournaments,
    isLoading,
  };
}

