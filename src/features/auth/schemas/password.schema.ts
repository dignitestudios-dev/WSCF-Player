import { z } from "zod";

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,50}$/;

export const PASSWORD_VALIDATION_MESSAGE =
  "Password must be between 8 and 50 characters and include uppercase, lowercase, number, and special character (@$!%*?&^#)";

export const passwordFieldSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters long")
  .max(50, "Password cannot exceed 50 characters")
  .regex(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE);
