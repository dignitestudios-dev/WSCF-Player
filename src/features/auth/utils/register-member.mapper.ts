import type { BecomeMemberFormData } from "@/features/auth/schemas/become-member.schema";

export function mapBecomeMemberToRegisterPayload(
  data: BecomeMemberFormData
): RegisterMemberPayload {
  return {
    name: data.name.trim(),
    profileImage: data.profileImage || "",
    grade: data.grade,
    dob: data.birthDate,
    city: data.city,
    streetAddress: data.streetAddress,
    zipCode: Number(data.zipCode),
    password: data.password,
    parents: {
      father: {
        name: data.fatherName,
        phone: data.fatherPhone,
        email: data.fatherEmail,
        isPrimary: data.primaryEmail === "father",
      },
      mother: {
        name: data.motherName,
        phone: data.motherPhone,
        email: data.motherEmail,
        isPrimary: data.primaryEmail === "mother",
      },
    },
  };
}
