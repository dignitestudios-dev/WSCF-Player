import { z } from "zod";
import { passwordFieldSchema } from "@/features/auth/schemas/password.schema";

export const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: passwordFieldSchema,
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
  sigma: z.string().optional(),
});

export type RegisterFormDataSchemaType = z.infer<typeof registerSchema>;
