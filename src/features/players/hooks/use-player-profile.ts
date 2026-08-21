"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";
import { DASHBOARD_PLAYERS_RATING_ROUTE, PLAYERS_RATING_ROUTE } from "@/config/routes";
import {
  useUserProfileQuery,
  useUserTournamentHistoryQuery,
} from "@/features/players/api/players.queries";

export function usePlayerProfile() {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const playerId = params.id as string;
  const fromDashboard = pathname.startsWith("/dashboard/player-profile");
  const backHrefParam = searchParams.get("backHref");

  const { data: userProfileData, isLoading: isLoadingProfile } = useUserProfileQuery(playerId);
  const { data: historyData, isLoading: isLoadingHistory } = useUserTournamentHistoryQuery(
    playerId,
    { page: 1, limit: 5, status: "completed" }
  );

  // The page is about a player — a child. `user` on this response is the
  // parent account behind them, which is where the address lives; the name,
  // grade and rating are the player's own.
  const profileData = userProfileData?.data?.player ?? userProfileData?.data?.playerProfile;
  const account = userProfileData?.data?.user ?? profileData?.account;
  const history = historyData?.data?.history || [];

  const fallbackAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ADADAD"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

  const player = {
    id: playerId,
    name: profileData?.name || "-",
    userId: profileData?.membershipId || "-",
    gender: profileData?.gender || "-",
    school: (typeof profileData?.school === 'object' ? profileData?.school?.name : profileData?.school) || "-",
    // One address per household, held on the account.
    city: account?.address?.city || "-",
    dateOfBirth: profileData?.dob
      ? new Date(profileData.dob).toLocaleDateString()
      : "-",
    currentRating: profileData?.rating || 0,
    grade: profileData?.grade || "-",
    status: profileData?.status || "-",
    avatarUrl: account?.profilePicture || fallbackAvatar,
    tournaments: history.map((t: any) => ({
      id: t._id || Math.random().toString(),
      name: t.tournament?.title || "Unknown Tournament",
      date: t.tournament?.date
        ? new Date(t.tournament.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "-",
      rating: t.rating || "-",
      ratingChange: t.ratingChange || "-",
    })),
  };

  return {
    player,
    isLoading: isLoadingProfile || isLoadingHistory,
    backHref: backHrefParam || (fromDashboard ? DASHBOARD_PLAYERS_RATING_ROUTE : PLAYERS_RATING_ROUTE),
  };
}
