import { z } from "zod";

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;

export const PASSWORD_VALIDATION_MESSAGE =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character (@$!%*?&^#)";

export const passwordFieldSchema = z
  .string()
  .min(1, "Password is required")
  .regex(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE);
