import axiosInstance from "@/lib/axios";

export async function getTournaments({
  page,
  limit,
  search,
  status,
}: GetTournamentsParams): Promise<TournamentsApiResponse> {
  const { data } = await axiosInstance.get<TournamentsApiResponse>("/tournament", {
    params: {
      page,
      limit,
      search: search || undefined,
      status: status || undefined,
    },
  });

  return data;
}

export async function getTournamentParticipants(
  tournamentId: string,
  { page, limit, search }: GetTournamentsParams
): Promise<TournamentParticipantsApiResponse> {
  const { data } = await axiosInstance.get<TournamentParticipantsApiResponse>(
    `/tournament/${tournamentId}/participants`,
    {
      params: {
        page,
        limit,
        search: search || undefined,
      },
    }
  );

  return data;
}

export async function getTournamentDetails(
  tournamentId: string
): Promise<TournamentDetailsApiResponse> {
  const { data } = await axiosInstance.get<TournamentDetailsApiResponse>(
    `/tournament/${tournamentId}`
  );
  return data;
}

export async function getEligibleDivisions(
  tournamentId: string
): Promise<EligibleDivisionsApiResponse> {
  const { data } = await axiosInstance.get<EligibleDivisionsApiResponse>(
    `/tournament/${tournamentId}/divisions`
  );
  return data;
}

export async function registerForTournament(
  tournamentId: string,
  payload: TournamentRegistrationPayload
): Promise<TournamentRegistrationApiResponse> {
  const { data } = await axiosInstance.post<TournamentRegistrationApiResponse>(
    `/tournament/${tournamentId}/register`,
    payload
  );
  return data;
}

export async function getMyTournaments(params: { page: number; limit: number; search?: string }) {
  const { data } = await axiosInstance.get("/tournament/my-tournaments", { params });
  return data;
}

/** The selected player's own entry in a tournament (division, team), or null. */
export interface MyTournamentRegistration {
  _id: string;
  enrolledAt: string;
  paymentStatus: string;
  division: { label?: string; criteria?: string } | null;
  team: { _id: string; name: string; code: string | null } | null;
}

export async function getMyTournamentRegistration(tournamentId: string) {
  const { data } = await axiosInstance.get<{
    data: { registration: MyTournamentRegistration | null };
  }>(`/tournament/${tournamentId}/my-registration`);
  return data;
}
