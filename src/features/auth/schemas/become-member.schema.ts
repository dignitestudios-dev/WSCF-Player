import { z } from "zod";
import { passwordFieldSchema } from "@/features/auth/schemas/password.schema";
import { differenceInYears } from "date-fns";

export const becomeMemberSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name is too long")
      .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name is too long")
      .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
    gender: z.enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Please select a valid gender" }),
    }),
    profileImage: z.any().optional(),
    sigma: z.string().optional(),
    birthDate: z.string().min(1, "Birth date is required").refine((date) => {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return false;
      return differenceInYears(new Date(), parsedDate) >= 4;
    }, "You must be at least 4 years old").refine((date) => {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return false;
      return differenceInYears(new Date(), parsedDate) <= 20;
    }, "You must be 20 years old or younger"),
    grade: z.string().min(1, "Grade is required").regex(/^(K|[1-9]|1[0-2])$/, "Invalid grade"),
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
    fatherName: z.string().max(100, "Name is too long").regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces").optional().or(z.literal("")),
    motherName: z.string().max(100, "Name is too long").regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces").optional().or(z.literal("")),
    fatherPhone: z.string().regex(/^(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})?$/, "Please enter a valid 10-digit phone number").max(14, "Phone number is too long").optional().or(z.literal("")),
    motherPhone: z.string().regex(/^(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})?$/, "Please enter a valid 10-digit phone number").max(14, "Phone number is too long").optional().or(z.literal("")),
    fatherEmail: z.string().email("Invalid email address").max(150, "Email is too long").optional().or(z.literal("")),
    motherEmail: z.string().email("Invalid email address").max(150, "Email is too long").optional().or(z.literal("")),
    primaryEmail: z.enum(["father", "mother"]),
    password: passwordFieldSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((value) => value === true, {
      message: "You must agree to the terms",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.primaryEmail === "father") {
      if (!data.fatherName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Father's name is required", path: ["fatherName"] });
      }
      if (!data.fatherPhone) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Father's phone is required", path: ["fatherPhone"] });
      }
      if (!data.fatherEmail) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Father's email is required", path: ["fatherEmail"] });
      }
    } else if (data.primaryEmail === "mother") {
      if (!data.motherName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Mother's name is required", path: ["motherName"] });
      }
      if (!data.motherPhone) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Mother's phone is required", path: ["motherPhone"] });
      }
      if (!data.motherEmail) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Mother's email is required", path: ["motherEmail"] });
      }
    }
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type BecomeMemberFormData = z.infer<typeof becomeMemberSchema>;
