"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema } from "@/features/dashboard/schemas/edit-profile.schema";

function profileToFormValues(profile: MyProfile): EditProfileFields {
  const parts = profile.name.split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";

  return {
    firstName,
    lastName,
    gender: (profile.gender === "male" || profile.gender === "female" || profile.gender === "other") ? profile.gender : "" as any,
    email: profile.email ?? "",
    grade: profile.grade ?? "",
    fatherName: profile.parent.name,
    fatherPhone: profile.parent.phone,
    fatherEmail: profile.parent.email,
  };
}

export function useEditProfile({
  profile,
  onSave,
  onClose,
}: {
  profile: MyProfile;
  onSave: (values: EditProfileFields) => void;
  onClose: () => void;
}) {
  const form = useForm<EditProfileFields>({
    resolver: zodResolver(editProfileSchema as any),
    defaultValues: profileToFormValues(profile),
  });

  async function onSubmit(values: EditProfileFields) {
    await onSave(values);
  }

  return {
    form,
    onSubmit,
  };
}
