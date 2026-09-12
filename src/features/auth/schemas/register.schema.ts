import { z } from "zod";
import { passwordFieldSchema } from "@/features/auth/schemas/password.schema";

const nameRegex = /^[a-zA-Z'.-]+(?: [a-zA-Z'.-]+)*$/;

export const registerSchema = z.object({
  username: z.string().min(1, "Username is required").max(30, "Username cannot exceed 30 characters"),
  email: z.string().email("Invalid email address").max(150, "Email is too long"),
  password: passwordFieldSchema,
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters")
    .regex(nameRegex, "First name can only contain letters, hyphens, periods, and apostrophes"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(nameRegex, "Last name can only contain letters, hyphens, periods, and apostrophes"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
  sigma: z.string().optional(),
});

export type RegisterFormDataSchemaType = z.infer<typeof registerSchema>;
