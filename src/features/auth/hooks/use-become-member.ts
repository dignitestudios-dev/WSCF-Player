"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getVerifyOtpRoute } from "@/config/routes";
import { uploadProfileImage } from "@/features/auth/api/auth.service";
import { useBecomeMemberMutation } from "@/features/auth/api/auth.mutations";
import {
  becomeMemberSchema,
  type BecomeMemberFormData,
} from "@/features/auth/schemas/become-member.schema";
import {
  showApiErrorToast,
  showApiSuccessToast,
} from "@/lib/api-toast";

export function useBecomeMember() {
  const router = useRouter();
  const { mutate: registerMember, isPending: isMutationPending } = useBecomeMemberMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const isPending = isMutationPending || isUploading;

  const form = useForm<BecomeMemberFormData>({
    resolver: zodResolver(becomeMemberSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      grade: "",
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
    },
  });

  function togglePassword() {
    setShowPassword((value) => !value);
  }

  function toggleConfirmPassword() {
    setShowConfirmPassword((value) => !value);
  }

  async function onSubmit(data: BecomeMemberFormData) {
    let profileImageUrl = "";

    try {
      if (data.profileImage && data.profileImage instanceof File) {
        setIsUploading(true);
        const uploadResponse = await uploadProfileImage(data.profileImage);
        profileImageUrl = uploadResponse.url;
      }
    } catch (error) {
      setIsUploading(false);
      showApiErrorToast(error as Error, "Failed to upload profile image.");
      return;
    }

    const payload = {
      ...data,
      profileImage: profileImageUrl,
    };

    registerMember(payload, {
      onSuccess: (response) => {
        setIsUploading(false);
        showApiSuccessToast(response, "Registration successful");

        const verificationEmail =
          data.primaryEmail === "father" ? data.fatherEmail : data.motherEmail;

        router.push(getVerifyOtpRoute(verificationEmail, "register"));
      },
      onError: (error) => {
        setIsUploading(false);
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
