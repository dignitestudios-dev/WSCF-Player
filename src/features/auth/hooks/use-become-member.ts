"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getVerifyOtpRoute } from "@/config/routes";
import { useBecomeMemberMutation } from "@/features/auth/api/auth.mutations";
import {
  becomeMemberSchema,
  type BecomeMemberFormData,
} from "@/features/auth/schemas/become-member.schema";
import { showApiErrorToast, showApiSuccessToast } from "@/lib/api-toast";

export function useBecomeMember() {
  const router = useRouter();
  const { mutate: registerMember, isPending } = useBecomeMemberMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<BecomeMemberFormData>({
    resolver: zodResolver(becomeMemberSchema),
    defaultValues: {
      city: "",
      streetAddress: "",
      zipCode: "",
      fatherName: "",
      motherName: "",
      fatherPhone: "",
      motherPhone: "",
      fatherEmail: "",
      motherEmail: "",
      primaryEmail: "father",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
      children: [],
    },
  });

  function togglePassword() {
    setShowPassword((value) => !value);
  }

  function toggleConfirmPassword() {
    setShowConfirmPassword((value) => !value);
  }

  function onSubmit(data: BecomeMemberFormData) {
    registerMember(data, {
      onSuccess: (response) => {
        showApiSuccessToast(response, "Registration successful");

        // The account is the primary guardian's, so that is the address the
        // verification code goes to.
        const verificationEmail =
          data.primaryEmail === "father" ? data.fatherEmail : data.motherEmail;

        router.push(getVerifyOtpRoute(verificationEmail!, "register"));
      },
      onError: (error) => {
        showApiErrorToast(error, "Registration failed. Please try again.");
      },
    });
  }

  return {
    form,
    onSubmit,
    isPending,
    showPassword,
    showConfirmPassword,
    togglePassword,
    toggleConfirmPassword,
  };
}
