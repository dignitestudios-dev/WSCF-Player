import { z } from "zod";

export const editProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  division: z.string().min(1, "Division is required"),
  email: z.string().email("Enter a valid email"),
  grade: z.string().min(1, "Grade is required"),
  parentFullName: z.string().min(1, "Parent full name is required"),
  parentPhone: z.string().min(1, "Phone is required"),
  parentEmail: z.string().email("Enter a valid parent email"),
});
