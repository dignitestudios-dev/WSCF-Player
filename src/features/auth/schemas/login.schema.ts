import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required").max(30, "Username cannot exceed 30 characters"),
  password: z.string().min(1, "Password is required").max(50, "Password cannot exceed 50 characters"),
});
