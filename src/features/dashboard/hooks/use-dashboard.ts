"use client";

import { useAuthUserQuery } from "@/features/auth/api/auth.queries";

export interface DashboardSummary {
  membershipStatus: string;
  hasMembership: boolean;
  validTill: string;
  userId: string;
  currentRating: number;
  lastUpdate: string;
  upcomingCount: number;
  nextTournamentAt: string | null;
}

export interface DashboardTournament {
  id: string;
  title: string;
  location: string;
  date: string;
  price: string;
  divisions: {
    _id: string;
    /** The name the admin gave the division. */
    name?: string;
    /** Same value as `name`; the API returns both. */
    label?: string;
    /** The rules behind the name, e.g. "Grades K-3 - Rating under 600". */
    criteria?: string | null;
    gradeMin?: number;
    gradeMax?: number;
    rating?: number | null;
    condition?: "under" | "above" | null;
  }[];
}

const defaultTournaments: DashboardTournament[] = [
  {
    id: "1",
    title: "USCF-Rated Scholastic May Summer Tournament",
    location: "Old Guard Games",
    date: "June 20, 2026",
    price: "$10.00",
    divisions: [],
  },
  {
    id: "2",
    title: "USCF-Rated Scholastic May Summer Tournament",
    location: "Old Guard Games",
    date: "June 20, 2026",
    price: "$10.00",
    divisions: [],
  },
  {
    id: "3",
    title: "Wisconsin Spring Open Championship",
    location: "Old Guard Games",
    date: "July 12, 2026",
    price: "$10.00",
    divisions: [],
  },
  {
    id: "4",
    title: "Junior Rapid Chess Challenge",
    location: "Milwaukee Chess Center",
    date: "August 5, 2026",
    price: "$10.00",
    divisions: [],
  },
];

export function useDashboard() {
  const { data: authData, isLoading } = useAuthUserQuery();

  const user = authData?.data?.user;
  const membership = authData?.data?.membership;
  const profile = authData?.data?.playerProfile;
  const upcomingCount = authData?.data?.upcomingTournamentCount || 0;
  const nextTournamentAt = authData?.data?.nextTournamentAt 
    ? new Date(authData.data.nextTournamentAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : null;

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
    // "Inactive" covered two different situations that need different words
    // and a different button: a lapsed member renews, someone who has never
    // joined buys. `membership` is null when nothing was ever purchased.
    membershipStatus: !membership
      ? "Not a member"
      : membership.status === "active"
        ? "Active"
        : membership.status === "cancelled"
          ? "Cancelled"
          : "Expired",
    hasMembership: Boolean(membership),
    validTill: validTillDate,
    userId: profile?.membershipId || user?._id || "N/A",
    currentRating: profile?.rating || 0,
    lastUpdate: lastUpdateDate,
    upcomingCount: upcomingCount,
    nextTournamentAt,
  };

  return {
    summary,
    tournaments: defaultTournaments,
    isLoading,
  };
}

