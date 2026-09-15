import { z } from "zod";
import { passwordFieldSchema } from "@/features/auth/schemas/password.schema";

export const setNewPasswordSchema = z
  .object({
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
