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
    { page: 1, limit: 5 }
  );

  const userData = userProfileData?.data?.user;
  const profileData = userProfileData?.data?.playerProfile;
  const history = historyData?.data?.history || [];

  const fallbackAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ADADAD"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

  const player = {
    id: playerId,
    name: userData?.name || "-",
    userId: profileData?.membershipId || profileData?.userId || "-",
    gender: profileData?.gender || "-",
    school: profileData?.school || "-",
    city: profileData?.city || "-",
    dateOfBirth: profileData?.dob
      ? new Date(profileData.dob).toLocaleDateString()
      : "-",
    currentRating: profileData?.rating || 0,
    status: userData?.status || "-",
    avatarUrl: userData?.profilePicture || fallbackAvatar,
    tournaments: history.map((t: any) => ({
      id: t._id || Math.random().toString(),
      name: t.tournament?.name || t.name || "Unknown Tournament",
      date: t.date || t.createdAt
        ? new Date(t.date || t.createdAt).toLocaleDateString()
        : "-",
      rating: t.rating || 0,
      ratingChange: t.ratingChange || "+0",
    })),
  };

  return {
    player,
    isLoading: isLoadingProfile || isLoadingHistory,
    backHref: backHrefParam || (fromDashboard ? DASHBOARD_PLAYERS_RATING_ROUTE : PLAYERS_RATING_ROUTE),
  };
}
