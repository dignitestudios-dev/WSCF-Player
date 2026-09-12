"use client";

import { useEffect, useState } from "react";
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

const BECOME_MEMBER_DRAFT_KEY = "wscf_become_member_draft";

export function getBecomeMemberDraft(): Partial<BecomeMemberFormData> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(BECOME_MEMBER_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveBecomeMemberDraft(data: Partial<BecomeMemberFormData>) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(BECOME_MEMBER_DRAFT_KEY, JSON.stringify(data));
  } catch {}
}

export function clearBecomeMemberDraft() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(BECOME_MEMBER_DRAFT_KEY);
  } catch {}
}

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

  useEffect(() => {
    const draft = getBecomeMemberDraft();
    if (draft) {
      form.reset({
        city: draft.city ?? "",
        streetAddress: draft.streetAddress ?? "",
        zipCode: draft.zipCode ?? "",
        fatherName: draft.fatherName ?? "",
        motherName: draft.motherName ?? "",
        fatherPhone: draft.fatherPhone ?? "",
        motherPhone: draft.motherPhone ?? "",
        fatherEmail: draft.fatherEmail ?? "",
        motherEmail: draft.motherEmail ?? "",
        primaryEmail: draft.primaryEmail ?? "father",
        password: draft.password ?? "",
        confirmPassword: draft.confirmPassword ?? "",
        agreeToTerms: draft.agreeToTerms ?? false,
        children: draft.children ?? [],
      });
    }

    const subscription = form.watch((value) => {
      saveBecomeMemberDraft(value as Partial<BecomeMemberFormData>);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  function togglePassword() {
    setShowPassword((value) => !value);
  }

  function toggleConfirmPassword() {
    setShowConfirmPassword((value) => !value);
  }

  function onSubmit(data: BecomeMemberFormData) {
    saveBecomeMemberDraft(data);
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
