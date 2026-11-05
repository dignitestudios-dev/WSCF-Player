"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";
import { DASHBOARD_PLAYERS_RATING_ROUTE, PLAYERS_RATING_ROUTE } from "@/config/routes";
import { parseCalendarDate } from "@/lib/calendar-date";
import { useAuth } from "@/hooks/use-auth";
import { useAuthUserQuery } from "@/features/auth/api/auth.queries";
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

  const { isAuthenticated, user: authUser } = useAuth();
  // Only query /user/me when authenticated; unauthenticated visitors (e.g. on
  // /auth/player-profile/[id]) would otherwise trigger a 401 response and redirect.
  const { data: authUserData } = useAuthUserQuery({
    enabled: Boolean(isAuthenticated),
  });

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

  const currentAccount = authUserData?.data?.user ?? authUser;
  const currentChildProfile = authUserData?.data?.playerProfile;
  const currentChildren: PlayerChild[] = authUserData?.data?.children ?? authUser?.children ?? [];

  // A user can only view their own (or their own children's) Date of Birth.
  const isMine = Boolean(
    isAuthenticated &&
    currentAccount && (
      (account?._id && String(account._id) === String(currentAccount._id)) ||
      (typeof account === "string" && String(account) === String(currentAccount._id)) ||
      (currentChildProfile?._id && String(currentChildProfile._id) === String(playerId)) ||
      (currentChildProfile?.membershipId && String(currentChildProfile.membershipId) === String(playerId)) ||
      (profileData?._id && currentChildProfile?._id && String(currentChildProfile._id) === String(profileData._id)) ||
      (profileData?.membershipId && currentChildProfile?.membershipId && String(currentChildProfile.membershipId) === String(profileData.membershipId)) ||
      currentChildren.some((child) =>
        Boolean(
          (child._id && String(child._id) === String(playerId)) ||
          (child.membershipId && String(child.membershipId) === String(playerId)) ||
          (profileData?._id && child._id && String(child._id) === String(profileData._id)) ||
          (profileData?.membershipId && child.membershipId && String(child.membershipId) === String(profileData.membershipId))
        )
      )
    )
  );

  const fallbackAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ADADAD"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

  const player = {
    id: playerId,
    name: profileData?.name || "-",
    userId: profileData?.membershipId || "-",
    gender: profileData?.gender || "-",
    // One address per household, held on the account.
    city: account?.address?.city || "-",
    dateOfBirth: isMine && profileData?.dob
      ? (parseCalendarDate(profileData.dob)?.toLocaleDateString() ?? "-")
      : null,
    currentRating: profileData?.rating || 0,
    grade: profileData?.grade || "-",
    status: profileData?.status || "-",
    team: profileData?.team?.name || "-",
    avatarUrl: account?.profilePicture || fallbackAvatar,
    // A history row carries its rating and points under `result`, which stays
    // null until that tournament's results are published. Reading them off the
    // row itself — as this used to — found nothing and printed "-" for every
    // tournament the player had ever played.
    tournaments: history.map((t: any) => {
      const result = t.result;

      return {
        id: t._id || Math.random().toString(),
        name: t.tournament?.title || "Unknown Tournament",
        date: t.tournament?.date
          ? new Date(t.tournament.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "-",
        rating: result?.rating ?? "-",
        previousRating: result?.previousRating ?? null,
        // The move, when we know both ends of it. A player who was unrated
        // before this tournament has no "change" to show, only a new rating.
        ratingChange:
          result?.rating != null && result?.previousRating != null
            ? result.rating - result.previousRating
            : null,
        points: result?.points ?? "-",
        place: result?.place ?? null,
        hasResult: Boolean(result),
      };
    }),
  };

  return {
    player,
    isMine,
    isLoading: isLoadingProfile || isLoadingHistory,
    backHref: backHrefParam || (fromDashboard ? DASHBOARD_PLAYERS_RATING_ROUTE : PLAYERS_RATING_ROUTE),
  };
}
