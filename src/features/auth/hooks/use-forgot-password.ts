"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPasswordMutation } from "@/features/auth/api/auth.mutations";
import { forgotPasswordSchema } from "@/features/auth/schemas/forgot-password.schema";
import { getVerifyOtpRoute } from "@/config/routes";

export function useForgotPassword() {
  const router = useRouter();
  const { mutate: sendResetLink, isPending, error } = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(data: ForgotPasswordFormData) {
    sendResetLink(data, {
      onSuccess: () => {
        router.push(getVerifyOtpRoute(data.email, "forgot-password"));
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
