import { z } from "zod";

export const memberLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(254, "Email cannot exceed 254 characters")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(50, "Password cannot exceed 50 characters"),
});
