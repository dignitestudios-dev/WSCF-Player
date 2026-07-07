"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/auth.slice";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/utils/constants";

export default function AuthRehydrator({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        dispatch(setCredentials({ user, accessToken: token }));
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}
