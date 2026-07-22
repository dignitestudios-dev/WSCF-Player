"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/auth.slice";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/lib/socket";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  TOKEN_MAX_AGE_SECONDS,
} from "@/utils/constants";
import { DEFAULT_REDIRECT } from "@/config/routes";

export function useAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  function handleLogout() {
    if (socket.connected) socket.disconnect();
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    dispatch(logout());
    queryClient.clear();
    router.push("/auth/login");
  }

  return {
    user,
    isAuthenticated,
    logout: handleLogout,
    defaultRedirect: DEFAULT_REDIRECT,
    tokenMaxAge: TOKEN_MAX_AGE_SECONDS,
  };
}
