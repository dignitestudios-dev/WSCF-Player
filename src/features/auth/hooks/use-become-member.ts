"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MEMBER_LOGIN_ROUTE, MEMBERSHIP_PAYMENT_ROUTE } from "@/config/routes";
import { useAppDispatch } from "@/store";
import { persistAuthSession } from "@/features/auth/utils/auth-session";
import { useBecomeMemberMutation } from "@/features/auth/api/auth.mutations";
import {
  becomeMemberSchema,
  type BecomeMemberFormData,
} from "@/features/auth/schemas/become-member.schema";
import { showApiErrorToast, showApiSuccessToast } from "@/lib/api-toast";

const BECOME_MEMBER_DRAFT_KEY = "wscf_become_member_draft";

export function clearBecomeMemberDraft() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(BECOME_MEMBER_DRAFT_KEY);
  } catch {}
}

export function useBecomeMember() {
  const router = useRouter();
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    // Purge any stale draft keys that may exist in the user's browser
    clearBecomeMemberDraft();
  }, []);

  function togglePassword() {
    setShowPassword((value) => !value);
  }

  function toggleConfirmPassword() {
    setShowConfirmPassword((value) => !value);
  }

  function onSubmit(data: BecomeMemberFormData) {
    clearBecomeMemberDraft();
    registerMember(data, {
      onSuccess: (response) => {
        showApiSuccessToast(response, "Registration successful");

        if (!response.accessToken || !response.user) {
          // The account exists but the server did not hand back a session.
          router.push(MEMBER_LOGIN_ROUTE);
          return;
        }

        // Signing up signs you in. Email verification is optional and comes
        // after payment, so the next step is paying for the players — the
        // route guard would send an unpaid account there anyway.
        persistAuthSession({
          user: response.user,
          accessToken: response.accessToken,
          dispatch,
        });
        router.push(MEMBERSHIP_PAYMENT_ROUTE);
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
