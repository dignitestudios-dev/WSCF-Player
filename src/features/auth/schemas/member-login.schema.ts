import { z } from "zod";
import { passwordFieldSchema } from "@/features/auth/schemas/password.schema";

export const memberLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: passwordFieldSchema,
});
