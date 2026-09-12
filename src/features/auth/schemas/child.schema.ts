import { z } from "zod";
import { differenceInYears } from "date-fns";

/**
 * One child on a parent's account.
 *
 * The membership id is assigned by the server, so
 * neither is collected here.
 */
export const childSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z'.-]+(?: [a-zA-Z'.-]+)*$/,
      "First name can only contain letters, hyphens, periods, and apostrophes",
    ),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z'.-]+(?: [a-zA-Z'.-]+)*$/,
      "Last name can only contain letters, hyphens, periods, and apostrophes",
    ),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
  birthDate: z
    .string()
    .min(1, "Birth date is required")
    .refine((date) => {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return false;
      return differenceInYears(new Date(), parsedDate) >= 4;
    }, "Player must be at least 4 years old")
    .refine((date) => {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return false;
      return differenceInYears(new Date(), parsedDate) <= 20;
    }, "Player must be 20 years old or younger"),
  grade: z
    .string()
    .min(1, "Grade is required")
    .regex(/^(K|[1-9]|1[0-2])$/, "Invalid grade"),
});

export type ChildFormData = z.infer<typeof childSchema>;
