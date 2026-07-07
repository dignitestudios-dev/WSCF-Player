import { z } from "zod";
import { passwordFieldSchema } from "@/features/auth/schemas/password.schema";

export const setNewPasswordSchema = z
  .object({
    password: passwordFieldSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
