import { z } from "zod";
import { passwordFieldSchema } from "@/features/auth/schemas/password.schema";

export const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: passwordFieldSchema,
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});
