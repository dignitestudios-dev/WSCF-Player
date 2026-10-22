import axios from "axios";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/utils/constants";
import { AUTH_REDIRECT } from "@/config/routes";
import {
  ACTIVE_PROFILE_KEY,
  clearActiveProfileId,
} from "@/features/players/active-profile";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.wisconsinscholasticchess.org/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // The token identifies the parent; this says which of their children the
    // request is on behalf of. The API verifies the child is theirs.
    const activeProfile = localStorage.getItem(ACTIVE_PROFILE_KEY);
    if (activeProfile) config.headers["x-player-profile"] = activeProfile;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        clearActiveProfileId();
        document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0`;
        window.location.href = AUTH_REDIRECT;
      }
    }

    const data = error.response?.data;
    const message =
      (typeof data?.message === "string" && data.message) ||
      (Array.isArray(data?.message) && data.message.join(", ")) ||
      error.message;
    return Promise.reject(new Error(message));
  },
);

export default axiosInstance;
