import { z } from "zod";

const nameRegex = /^[a-zA-Z\s\-\']+$/;
const phoneRegex = /^\+?[\d\s\-\(\)]+$/;

export const editProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters")
    .regex(nameRegex, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  division: z
    .string()
    .trim()
    .min(1, "Division is required")
    .max(30, "Division is too long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  grade: z
    .string()
    .trim()
    .min(1, "Grade is required")
    .max(20, "Grade is too long"),
  parentFullName: z
    .string()
    .trim()
    .min(2, "Parent full name must be at least 2 characters")
    .max(50, "Parent full name must be less than 50 characters")
    .regex(nameRegex, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  parentPhone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number is too long")
    .regex(phoneRegex, "Please enter a valid phone number"),
  parentEmail: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Parent email is required")
    .email("Please enter a valid parent email address"),
});
