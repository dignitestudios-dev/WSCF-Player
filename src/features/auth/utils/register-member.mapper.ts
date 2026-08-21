import type { BecomeMemberFormData } from "@/features/auth/schemas/become-member.schema";

/**
 * Turns the signup form into the account the API creates: one parent, one
 * household address, and every child on it.
 */
export function mapBecomeMemberToRegisterPayload(
  data: BecomeMemberFormData,
): RegisterMemberPayload {
  return {
    password: data.password,
    address: {
      city: data.city,
      streetAddress: data.streetAddress,
      zipCode: Number(data.zipCode),
    },
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
    children: data.children.map((child) => ({
      firstName: child.firstName.trim(),
      lastName: child.lastName.trim(),
      gender: child.gender,
      grade: child.grade,
      dob: child.birthDate,
    })),
  };
}
