import { useQuery, useMutation } from "@tanstack/react-query";
import { getTournaments, getTournamentParticipants, getTournamentDetails, getTournamentFormFields, getMyTournaments, registerForTournament } from "@/features/tournaments/api/tournaments.service";

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

export function useTournamentFormFieldsQuery(tournamentId: string) {
  return useQuery({
    queryKey: ["tournamentFormFields", tournamentId],
    queryFn: () => getTournamentFormFields(tournamentId),
    enabled: !!tournamentId,
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
