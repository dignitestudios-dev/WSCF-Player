"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema } from "@/features/dashboard/schemas/edit-profile.schema";

function profileToFormValues(profile: MyProfile): EditProfileFields {
  return {
    // Straight from the record. These used to be recovered by splitting the
    // joined display name on its first space, which quietly rewrote anyone
    // whose name did not happen to be two single words: "Mary Jane Watson"
    // came back as "Mary" + "Jane Watson", and saving an unrelated edit then
    // stored that wrong surname.
    firstName: profile.firstName,
    lastName: profile.lastName,
    // A profile saved before "other" was removed falls back to empty, so the
    // player has to pick one of the two supported values before saving.
    gender:
      profile.gender === "male" || profile.gender === "female"
        ? profile.gender
        : ("" as any),
    email: profile.email ?? "",
    grade: profile.grade ?? "",
    city: profile.city ?? "",
    // Each guardian fills their own row. Previously the primary guardian was
    // loaded into the father's row whoever they were, so a mother-led account
    // showed her details under "Father" and left "Mother" blank.
    fatherName: profile.parents.father?.name ?? "",
    fatherPhone: profile.parents.father?.phone ?? "",
    fatherEmail: profile.parents.father?.email ?? "",
    motherName: profile.parents.mother?.name ?? "",
    motherPhone: profile.parents.mother?.phone ?? "",
    motherEmail: profile.parents.mother?.email ?? "",
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
