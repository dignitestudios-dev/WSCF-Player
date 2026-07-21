"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema } from "@/features/dashboard/schemas/edit-profile.schema";

function profileToFormValues(profile: MyProfile): EditProfileFields {
  return {
    fullName: profile.name,
    division: profile.division ?? "U18",
    email: profile.email ?? "",
    grade: profile.grade ?? "",
    parentFullName: profile.parent.name,
    parentPhone: profile.parent.phone,
    parentEmail: profile.parent.email,
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
    resolver: zodResolver(editProfileSchema),
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
