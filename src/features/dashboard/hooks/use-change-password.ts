"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePasswordMutation } from "@/features/auth/api/auth.mutations";
import { changePasswordSchema } from "@/features/dashboard/schemas/change-password.schema";
import { useAuth } from "@/hooks/use-auth";

export function useChangePassword() {
  const { user } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const { mutate: updatePassword, isPending, error } = useChangePasswordMutation();

  const form = useForm<ChangePasswordFields>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: ChangePasswordFields) {
    if (!user?.email) return;

    updatePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.password,
      },
      {
        onSuccess: () => {
          form.reset();
          setIsSuccessOpen(true);
        },
      }
    );
  }

  function closeSuccess() {
    setIsSuccessOpen(false);
  }

  return {
    form,
    onSubmit,
    isPending,
    error: error?.message ?? null,
    showCurrentPassword,
    showPassword,
    showConfirmPassword,
    toggleCurrentPassword: () => setShowCurrentPassword((prev) => !prev),
    togglePassword: () => setShowPassword((prev) => !prev),
    toggleConfirmPassword: () => setShowConfirmPassword((prev) => !prev),
    isSuccessOpen,
    closeSuccess,
  };
}
