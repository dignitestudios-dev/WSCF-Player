import { z } from "zod";

const nameRegex = /^[a-zA-Z\s]+$/;
const phoneRegex = /^\+?[\d\s\-\(\)]+$/;

export const editProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name is too long")
    .regex(nameRegex, "Name can only contain letters and spaces"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name is too long")
    .regex(nameRegex, "Name can only contain letters and spaces"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
  sigma: z.string().optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  grade: z
    .string()
    .trim()
    .min(1, "Grade is required")
    .regex(/^(K|[1-9]|1[0-2])$/, "Invalid grade"),
  // A guardian's name is free text, exactly as it is on signup: people write
  // full names with initials, digits, hyphens, apostrophes and non-Latin
  // characters, and none of that is invalid.
  fatherName: z.string().max(100, "Name is too long").optional().or(z.literal("")),
  motherName: z.string().max(100, "Name is too long").optional().or(z.literal("")),
  fatherPhone: z.string().regex(phoneRegex, "Please enter a valid phone number").max(20, "Phone number is too long").optional().or(z.literal("")),
  motherPhone: z.string().regex(phoneRegex, "Please enter a valid phone number").max(20, "Phone number is too long").optional().or(z.literal("")),
  fatherEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  motherEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
})
.refine((data) => {
  const hasFather = Boolean(data.fatherName && data.fatherPhone);
  const hasMother = Boolean(data.motherName && data.motherPhone);
  return hasFather || hasMother;
}, {
  message: "At least one parent's complete information (name and phone) is required.",
  path: ["fatherName"],
})
.refine((data) => {
  const fatherHasPartial = Boolean(data.fatherName || data.fatherPhone) && !(data.fatherName && data.fatherPhone);
  return !fatherHasPartial;
}, {
  message: "Father's name and phone must both be provided if one is.",
  path: ["fatherName"],
})
.refine((data) => {
  const motherHasPartial = Boolean(data.motherName || data.motherPhone) && !(data.motherName && data.motherPhone);
  return !motherHasPartial;
}, {
  message: "Mother's name and phone must both be provided if one is.",
  path: ["motherName"],
});
