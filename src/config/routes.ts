export const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/member-login",
  "/auth/forgot-password",
  "/auth/players-rating-lookup",
  "/auth/verify-otp",
  "/auth/set-new-password",
  "/auth/register",
  "/auth/email-verified",
  "/auth/membership-validation",
  "/auth/tournament-participants",
  "/membership/success",
  "/membership/cancel",
  "/membership/select-profile",
];
// /players is the picker, the add-a-child flow and the record lookup: all of
// them need an account, none of them is the dashboard.
export const PROTECTED_ROUTES = ["/dashboard", "/players"];
export const AUTH_REDIRECT = "/auth/login";
export const MEMBER_LOGIN_ROUTE = "/auth/member-login";
export const BECOME_MEMBER_ROUTE = "/auth/register";
export const FORGOT_PASSWORD_ROUTE = "/auth/forgot-password";
export const PLAYERS_RATING_ROUTE = "/auth/players-rating-lookup";
export const DASHBOARD_PLAYERS_RATING_ROUTE = "/dashboard/players-rating-lookup";
export const TOURNAMENT_PARTICIPANTS_ROUTE = "/auth/tournament-participants";
export const PLAYER_PROFILE_ROUTE = "/auth/player-profile";
export const DASHBOARD_PLAYER_PROFILE_ROUTE = "/dashboard/player-profile";

export function getPlayerProfileRoute(id: string) {
  return `${PLAYER_PROFILE_ROUTE}/${id}`;
}

export function getDashboardPlayerProfileRoute(id: string) {
  return `${DASHBOARD_PLAYER_PROFILE_ROUTE}/${id}`;
}
export const VERIFY_OTP_ROUTE = "/auth/verify-otp";
export const EMAIL_VERIFIED_ROUTE = "/auth/email-verified";
export const MEMBERSHIP_VALIDATION_ROUTE = "/auth/membership-validation";
export {
  SELECT_PLAYER_ROUTE,
  ADD_PLAYER_ROUTE,
  CLAIM_RATINGS_ROUTE,
} from "@/features/players/routes";
export {
  MEMBERSHIP_SUCCESS_ROUTE,
  MEMBERSHIP_CANCEL_ROUTE,
  MEMBERSHIP_SELECT_PROFILE_ROUTE,
} from "@/features/membership/constants/routes";
export const SET_NEW_PASSWORD_ROUTE = "/auth/set-new-password";
export const DEFAULT_REDIRECT = "/dashboard";
export const SETTINGS_ROUTE = "/dashboard/settings";
export const MY_PROFILE_ROUTE = "/dashboard/my-profile";
export const REGISTERED_TOURNAMENTS_ROUTE = "/dashboard/registered-tournaments";
export const DASHBOARD_TOURNAMENTS_ROUTE = "/dashboard/tournaments";
export const MY_HISTORY_ROUTE = "/dashboard/my-history";
export const DASHBOARD_CHANGE_PASSWORD_ROUTE = "/dashboard/change-password";
export const DASHBOARD_TOURNAMENT_DETAILS_ROUTE = "/dashboard/tournaments";
export const DASHBOARD_TOURNAMENT_PARTICIPANTS_ROUTE = "/dashboard/tournament-participants";

export function getTournamentDetailsRoute(id: string, from?: "dashboard" | "registered") {
  const base = `${DASHBOARD_TOURNAMENT_DETAILS_ROUTE}/${id}`;
  if (!from) return base;
  return `${base}?from=${from}`;
}

export function getTournamentRegisteredPlayersRoute(tournamentId: string) {
  return `${DASHBOARD_TOURNAMENT_DETAILS_ROUTE}/${tournamentId}/participants`;
}

export function getDashboardTournamentParticipantsRoute(tournamentId?: string) {
  if (!tournamentId) return DASHBOARD_TOURNAMENT_PARTICIPANTS_ROUTE;
  return getTournamentRegisteredPlayersRoute(tournamentId);
}

export function getVerifyOtpRoute(
  email: string,
  from: "register" | "forgot-password" = "forgot-password"
) {
  const params = new URLSearchParams({ email, from });
  return `${VERIFY_OTP_ROUTE}?${params.toString()}`;
}

// Add as the project grows:
// export const ROLE_ROUTES: Record<string, string[]> = { "/admin": ["admin"] };
// export const ONBOARDING_ROUTE = "/onboarding";
// export const MAINTENANCE_ROUTE = "/maintenance";
