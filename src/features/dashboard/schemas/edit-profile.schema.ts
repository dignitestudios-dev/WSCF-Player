import { z } from "zod";

const nameRegex = /^[a-zA-Z'.-]+(?: [a-zA-Z'.-]+)*$/;
const phoneRegex = /^(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})?$/;

// A guardian's name takes letters and the punctuation real names carry --
// apostrophes, hyphens, periods, accents -- but no digits.
const guardianNameRegex = /^[a-zA-Z'.-]+(?: [a-zA-Z'.-]+)*$/;
const guardianNameMessage = "Name can only contain letters, hyphens, periods, and apostrophes";

export const editProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters")
    .regex(nameRegex, "First name can only contain letters, hyphens, periods, and apostrophes"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(nameRegex, "Last name can only contain letters, hyphens, periods, and apostrophes"),
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
  // Shown on the profile page but previously absent from this form, so it
  // could be read and never corrected.
  city: z
    .string()
    .trim()
    .max(30, "City cannot exceed 30 characters")
    .regex(/^[a-zA-Z.-]+(?: [a-zA-Z.-]+)*$/, "City can only contain letters, periods, and hyphens")
    .optional()
    .or(z.literal("")),
  fatherName: z
    .string()
    .max(50, "Name cannot exceed 50 characters")
    .regex(guardianNameRegex, guardianNameMessage)
    .optional()
    .or(z.literal("")),
  motherName: z
    .string()
    .max(50, "Name cannot exceed 50 characters")
    .regex(guardianNameRegex, guardianNameMessage)
    .optional()
    .or(z.literal("")),
  fatherPhone: z.string().regex(phoneRegex, "Please enter a valid 10-digit phone number").max(14, "Phone number is too long").optional().or(z.literal("")),
  motherPhone: z.string().regex(phoneRegex, "Please enter a valid 10-digit phone number").max(14, "Phone number is too long").optional().or(z.literal("")),
  fatherEmail: z.string().email("Invalid email address").max(150, "Email is too long").optional().or(z.literal("")),
  motherEmail: z.string().email("Invalid email address").max(150, "Email is too long").optional().or(z.literal("")),
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
