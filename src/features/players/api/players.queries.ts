import { useQuery } from "@tanstack/react-query";
import { getUserProfile, getUserTournamentHistory, getUsers } from "@/features/players/api/players.service";

export function useUserProfileQuery(userId: string) {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });
}

export function useUserTournamentHistoryQuery(
  userId: string,
  params: { page: number; limit: number }
) {
  return useQuery({
    queryKey: ["userTournamentHistory", userId, params],
    queryFn: () => getUserTournamentHistory(userId, params),
    enabled: !!userId,
  });
}

export function useUsersQuery(params: { page: number; limit: number; search?: string }) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
}
