import { z } from "zod";
import { passwordFieldSchema } from "@/features/auth/schemas/password.schema";
import { differenceInYears } from "date-fns";

export const becomeMemberSchema = z
  .object({
    name: z.string().min(1, "Full name is required").max(100, "Full name is too long"),
    birthDate: z.string().min(1, "Birth date is required").refine((date) => {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return false;
      return differenceInYears(new Date(), parsedDate) >= 4;
    }, "You must be at least 4 years old"),
    grade: z.string().min(1, "Grade is required").max(10, "Grade is too long").regex(/^\d+$/, "Grade must be a number"),
    city: z.string().min(1, "City is required").max(100, "City is too long"),
    streetAddress: z.string().min(1, "Street address is required").max(200, "Street address is too long"),
    zipCode: z
      .string()
      .min(1, "Zip code is required")
      .max(20, "Zip code is too long")
      .regex(/^\d+$/, "Zip code must be a number"),
    fatherName: z.string().min(1, "Father's/Guardian name is required").max(100, "Name is too long"),
    motherName: z.string().min(1, "Mother's/Guardian name is required").max(100, "Name is too long"),
    fatherPhone: z.string().min(1, "Father's/Guardian phone is required").max(20, "Phone is too long"),
    motherPhone: z.string().min(1, "Mother's/Guardian phone is required").max(20, "Phone is too long"),
    fatherEmail: z.string().email("Invalid email address").max(150, "Email is too long"),
    motherEmail: z.string().email("Invalid email address").max(150, "Email is too long"),
    primaryEmail: z.enum(["father", "mother"]),
    password: passwordFieldSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((value) => value === true, {
      message: "You must agree to the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type BecomeMemberFormData = z.infer<typeof becomeMemberSchema>;
