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
