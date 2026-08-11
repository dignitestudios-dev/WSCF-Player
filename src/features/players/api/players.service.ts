import axiosInstance from "@/lib/axios";

export async function getUserProfile(userId: string) {
  const { data } = await axiosInstance.get(`/user/${userId}`);
  return data;
}

export async function getUserTournamentHistory(
  userId: string,
  params: { page: number; limit: number; status?: string }
) {
  const { data } = await axiosInstance.get(`/tournament/user-history/${userId}`, {
    params,
  });
  return data;
}

export async function getUsers(params: { page: number; limit: number; search?: string }) {
  const { data } = await axiosInstance.get("/user", { params });
  return data;
}

export async function getMatchSuggestions() {
  const { data } = await axiosInstance.get("/player/match-suggestions");
  return data;
}

export async function attachProfile(payload: { masterPlayerId: string }) {
  const { data } = await axiosInstance.post("/player/attach-profile", payload);
  return data;
}

