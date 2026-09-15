import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(254, "Email cannot exceed 254 characters")
    .email("Invalid email address"),
});
