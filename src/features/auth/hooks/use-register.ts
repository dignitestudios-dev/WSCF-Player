"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/auth.slice";
import { useRegisterMutation } from "@/features/auth/api/auth.mutations";
import { registerSchema, type RegisterFormDataSchemaType } from "@/features/auth/schemas/register.schema";
import { DEFAULT_REDIRECT } from "@/config/routes";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  TOKEN_MAX_AGE_SECONDS,
} from "@/utils/constants";

export function useRegister() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mutate: register, isPending, error } = useRegisterMutation();

  const form = useForm<RegisterFormDataSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      gender: undefined,
    },
  });

  function onSubmit(data: RegisterFormDataSchemaType) {
    register(data, {
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
