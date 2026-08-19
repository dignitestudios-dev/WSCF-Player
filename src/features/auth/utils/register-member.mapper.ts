import type { BecomeMemberFormData } from "@/features/auth/schemas/become-member.schema";

export function mapBecomeMemberToRegisterPayload(
  data: BecomeMemberFormData
): RegisterMemberPayload {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    gender: data.gender,
    sigma: data.sigma,
    profileImage: data.profileImage || "",
    grade: data.grade,
    dob: data.birthDate,
    city: data.city,
    streetAddress: data.streetAddress,
    zipCode: Number(data.zipCode),
    password: data.password,
    parents: {
      ...(data.fatherName || data.fatherPhone || data.fatherEmail
        ? {
            father: {
              name: data.fatherName || "",
              phone: data.fatherPhone || "",
              email: data.fatherEmail || "",
              isPrimary: data.primaryEmail === "father",
            },
          }
        : {}),
      ...(data.motherName || data.motherPhone || data.motherEmail
        ? {
            mother: {
              name: data.motherName || "",
              phone: data.motherPhone || "",
              email: data.motherEmail || "",
              isPrimary: data.primaryEmail === "mother",
            },
          }
        : {}),
    },
  };
}
