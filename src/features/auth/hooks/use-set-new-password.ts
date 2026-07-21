"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetNewPasswordMutation } from "@/features/auth/api/auth.mutations";
import { setNewPasswordSchema } from "@/features/auth/schemas/set-new-password.schema";
import { AUTH_REDIRECT } from "@/config/routes";

export function useSetNewPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { mutate: updatePassword, isPending, error } = useSetNewPasswordMutation();

  const form = useForm<SetNewPasswordFields>({
    resolver: zodResolver(setNewPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  function onSubmit(data: SetNewPasswordFields) {
    if (!email) return;

    updatePassword(
      { email, password: data.password, confirmPassword: data.confirmPassword, token },
      {
        onSuccess: () => {
          setIsSuccessModalOpen(true);
        },
      }
    );
  }

  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  function toggleConfirmPassword() {
    setShowConfirmPassword((prev) => !prev);
  }

  function closeSuccessModal() {
    setIsSuccessModalOpen(false);
  }

  function handleSuccessContinue() {
    setIsSuccessModalOpen(false);
    router.push(AUTH_REDIRECT);
  }

  return {
    form,
    onSubmit,
    isPending,
    error: error?.message ?? null,
    showPassword,
    showConfirmPassword,
    togglePassword,
    toggleConfirmPassword,
    isSuccessModalOpen,
    closeSuccessModal,
    handleSuccessContinue,
  };
}
