import { useQuery, useMutation } from "@tanstack/react-query";
import { getTournaments, getTournamentParticipants, getTournamentDetails, getEligibleDivisions, getMyTournaments, registerForTournament, getMyTournamentRegistration } from "@/features/tournaments/api/tournaments.service";

export function useTournamentsQuery(params: GetTournamentsParams) {
  return useQuery({
    queryKey: ["tournaments", params],
    queryFn: () => getTournaments(params),
  });
}

export function useTournamentParticipantsQuery(
  tournamentId: string,
  params: GetTournamentsParams
) {
  return useQuery({
    queryKey: ["tournamentParticipants", tournamentId, params],
    queryFn: () => getTournamentParticipants(tournamentId, params),
    enabled: !!tournamentId,
  });
}

export function useTournamentDetailsQuery(tournamentId: string) {
  return useQuery({
    queryKey: ["tournamentDetails", tournamentId],
    queryFn: () => getTournamentDetails(tournamentId),
    enabled: !!tournamentId,
  });
}

export function useEligibleDivisionsQuery(tournamentId: string) {
  return useQuery({
    queryKey: ["tournamentDivisions", tournamentId],
    queryFn: () => getEligibleDivisions(tournamentId),
    enabled: !!tournamentId,
    // Form field definitions don't change mid-session. Prevent background
    // refetches (e.g. window focus) that would give `fields` a new array
    // reference and potentially interfere with the registration form state.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useTournamentRegistrationMutation(tournamentId: string) {
  return useMutation({
    mutationFn: (payload: TournamentRegistrationPayload) =>
      registerForTournament(tournamentId, payload),
  });
}

export function useMyTournamentsQuery(params: { page: number; limit: number; search?: string }) {
  return useQuery({
    queryKey: ["myTournaments", params],
    queryFn: () => getMyTournaments(params),
  });
}

/**
 * Whether the selected player is in this tournament, and with which division and
 * team. Always refetched on open (staleTime 0): a registration made a moment ago
 * must not read as "not registered" from a cached answer.
 */
export function useMyTournamentRegistrationQuery(tournamentId: string, playerId?: string) {
  return useQuery({
    queryKey: ["myTournamentRegistration", tournamentId, playerId ?? null],
    queryFn: () => getMyTournamentRegistration(tournamentId),
    enabled: !!tournamentId && !!playerId,
    staleTime: 0,
  });
}
