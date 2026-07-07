"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/auth.slice";
import { useMemberLoginMutation } from "@/features/auth/api/auth.mutations";
import { memberLoginSchema } from "@/features/auth/schemas/member-login.schema";
import { DEFAULT_REDIRECT } from "@/config/routes";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  TOKEN_MAX_AGE_SECONDS,
} from "@/utils/constants";
import {
  showApiErrorToast,
  showApiSuccessToast,
} from "@/lib/api-toast";

export function useMemberLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mutate: signIn, isPending } = useMemberLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<MemberLoginCredentials>({
    resolver: zodResolver(memberLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(data: MemberLoginCredentials) {
    signIn(data, {
      onSuccess: (response) => {
        const { accessToken, refreshToken, apiMessage, ...user } = response;

        showApiSuccessToast(apiMessage ?? response, "Login successful");

        localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        document.cookie = `${AUTH_TOKEN_KEY}=${accessToken}; path=/; max-age=${TOKEN_MAX_AGE_SECONDS}`;
        dispatch(setCredentials({ user, accessToken }));
        router.push(DEFAULT_REDIRECT);
      },
      onError: (error) => {
        showApiErrorToast(error, "Login failed. Please try again.");
      },
    });
  }

  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  return {
    form,
    onSubmit,
    isPending,
    showPassword,
    togglePassword,
  };
}
