import axios from "axios";
import { AUTH_TOKEN_KEY } from "@/utils/constants";

const axiosInstance = axios.create({
  baseURL: "https://416zwbs6-3050.inc1.devtunnels.ms",
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
    const data = error.response?.data;
    const message =
      (typeof data?.message === "string" && data.message) ||
      (Array.isArray(data?.message) && data.message.join(", ")) ||
      error.message;
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
