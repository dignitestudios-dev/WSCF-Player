import { z } from "zod";
import { passwordFieldSchema } from "@/features/auth/schemas/password.schema";

const nameRegex = /^[a-zA-Z'.-]+(?: [a-zA-Z'.-]+)*$/;

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(30, "Username cannot exceed 30 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(254, "Email cannot exceed 254 characters"),
  password: passwordFieldSchema,
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(30, "First name cannot exceed 30 characters")
    .regex(nameRegex, "First name can only contain letters, hyphens, periods, and apostrophes"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(30, "Last name cannot exceed 30 characters")
    .regex(nameRegex, "Last name can only contain letters, hyphens, periods, and apostrophes"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
  sigma: z.string().optional(),
});

export type RegisterFormDataSchemaType = z.infer<typeof registerSchema>;
