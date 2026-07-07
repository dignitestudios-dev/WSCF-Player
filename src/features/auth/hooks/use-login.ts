"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/auth.slice";
import { useLoginMutation } from "@/features/auth/api/auth.mutations";
import { loginSchema } from "@/features/auth/schemas/login.schema";
import { DEFAULT_REDIRECT } from "@/config/routes";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  TOKEN_MAX_AGE_SECONDS,
} from "@/utils/constants";

export function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mutate: login, isPending, error } = useLoginMutation();

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  function onSubmit(data: LoginCredentials) {
    login(data, {
      onSuccess: (response) => {
        const { accessToken, refreshToken, ...user } = response;
        localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        document.cookie = `${AUTH_TOKEN_KEY}=${accessToken}; path=/; max-age=${TOKEN_MAX_AGE_SECONDS}`;
        dispatch(setCredentials({ user, accessToken }));
        router.push(DEFAULT_REDIRECT);
      },
    });
  }

  return {
    form,
    onSubmit,
    isPending,
    error: error?.message ?? null,
  };
}
