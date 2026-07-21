"use client";

import { useParams, usePathname } from "next/navigation";
import { DASHBOARD_PLAYERS_RATING_ROUTE, PLAYERS_RATING_ROUTE } from "@/config/routes";
import {
  useUserProfileQuery,
  useUserTournamentHistoryQuery,
} from "@/features/players/api/players.queries";

export function usePlayerProfile() {
  const params = useParams();
  const pathname = usePathname();
  const playerId = params.id as string;
  const fromDashboard = pathname.startsWith("/dashboard/player-profile");

  const { data: userProfileData, isLoading: isLoadingProfile } = useUserProfileQuery(playerId);
  const { data: historyData, isLoading: isLoadingHistory } = useUserTournamentHistoryQuery(
    playerId,
    { page: 1, limit: 5 }
  );

  const userData = userProfileData?.data?.user;
  const profileData = userProfileData?.data?.playerProfile;
  const history = historyData?.data?.history || [];

  const player = {
    id: playerId,
    name: userData?.name || "N/A",
    userId: profileData?.membershipId || profileData?.userId || "N/A",
    gender: profileData?.gender || "N/A",
    school: profileData?.school || "N/A",
    city: profileData?.city || "N/A",
    dateOfBirth: profileData?.dob
      ? new Date(profileData.dob).toLocaleDateString()
      : "N/A",
    currentRating: profileData?.rating || 0,
    status: userData?.status || "N/A",
    avatarUrl: userData?.profilePicture || "/images/avatar-placeholder.png",
    tournaments: history.map((t: any) => ({
      id: t._id || Math.random().toString(),
      name: t.tournament?.name || t.name || "Unknown Tournament",
      date: t.date || t.createdAt
        ? new Date(t.date || t.createdAt).toLocaleDateString()
        : "N/A",
      rating: t.rating || 0,
      ratingChange: t.ratingChange || "+0",
    })),
  };

  return {
    player,
    isLoading: isLoadingProfile || isLoadingHistory,
    backHref: fromDashboard ? DASHBOARD_PLAYERS_RATING_ROUTE : PLAYERS_RATING_ROUTE,
  };
}
