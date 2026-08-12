import { z } from "zod";
import { passwordFieldSchema } from "@/features/auth/schemas/password.schema";
import { differenceInYears } from "date-fns";

export const becomeMemberSchema = z
  .object({
    profileImage: z.any().optional(),
    name: z
      .string()
      .min(1, "Full name is required")
      .max(100, "Full name is too long")
      .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
    birthDate: z.string().min(1, "Birth date is required").refine((date) => {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return false;
      return differenceInYears(new Date(), parsedDate) >= 4;
    }, "You must be at least 4 years old"),
    grade: z.string().min(1, "Grade is required").max(10, "Grade is too long").regex(/^\d+$/, "Grade must be a number"),
    city: z
      .string()
      .min(1, "City is required")
      .max(100, "City is too long")
      .regex(/^[a-zA-Z\s]+$/, "City can only contain letters and spaces"),
    streetAddress: z
      .string()
      .min(1, "Street address is required")
      .max(100, "Street address cannot exceed 100 characters"),
    zipCode: z
      .string()
      .min(1, "Zip code is required")
      .regex(/^\d{5}$/, "Zip code must be exactly 5 digits")
      .max(5, "Zip code must be exactly 5 digits"),
    fatherName: z
      .string()
      .min(1, "Father's/Guardian name is required")
      .max(100, "Name is too long")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    motherName: z
      .string()
      .min(1, "Mother's/Guardian name is required")
      .max(100, "Name is too long")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    fatherPhone: z
      .string()
      .min(1, "Father's/Guardian phone is required")
      .regex(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, "Please enter a valid 10-digit phone number")
      .max(14, "Phone number is too long"),
    motherPhone: z
      .string()
      .min(1, "Mother's/Guardian phone is required")
      .regex(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, "Please enter a valid 10-digit phone number")
      .max(14, "Phone number is too long"),
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
