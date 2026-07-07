import { z } from "zod";
import { passwordFieldSchema } from "@/features/auth/schemas/password.schema";

export const becomeMemberSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    birthDate: z.string().min(1, "Birth date is required"),
    grade: z.string().min(1, "Grade is required"),
    city: z.string().min(1, "City is required"),
    streetAddress: z.string().min(1, "Street address is required"),
    zipCode: z
      .string()
      .min(1, "Zip code is required")
      .regex(/^\d+$/, "Zip code must be a number"),
    fatherName: z.string().min(1, "Father's/Guardian name is required"),
    motherName: z.string().min(1, "Mother's/Guardian name is required"),
    fatherPhone: z.string().min(1, "Father's/Guardian phone is required"),
    motherPhone: z.string().min(1, "Mother's/Guardian phone is required"),
    fatherEmail: z.string().email("Invalid email address"),
    motherEmail: z.string().email("Invalid email address"),
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
