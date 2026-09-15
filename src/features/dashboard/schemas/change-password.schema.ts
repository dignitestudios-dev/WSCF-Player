import { z } from "zod";
import { passwordFieldSchema } from "@/features/auth/schemas/password.schema";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .max(50, "Password cannot exceed 50 characters"),
    password: passwordFieldSchema,
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required")
      .max(50, "Confirm password cannot exceed 50 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
