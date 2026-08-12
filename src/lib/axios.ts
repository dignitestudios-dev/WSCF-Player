import axios from "axios";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/utils/constants";
import { AUTH_REDIRECT } from "@/config/routes";

const axiosInstance = axios.create({
  baseURL: "https://api.wisconsinscholasticchess.org/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
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
  }
);

export default axiosInstance;
