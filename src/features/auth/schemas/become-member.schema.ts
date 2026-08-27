import { z } from "zod";
import { passwordFieldSchema } from "@/features/auth/schemas/password.schema";
import { childSchema } from "@/features/auth/schemas/child.schema";

/**
 * Signing up creates a parent's account and the children on it.
 *
 * The parent's own details, the household address and the password belong to
 * the account; everything about a player lives on a child, and at least one is
 * required — an account with no players has nothing to do.
 */
// A guardian's name takes letters and the punctuation real names carry --
// apostrophes, hyphens, periods, accents -- but no digits. People do write
// "O'Brien-Smith" and "Dr. J. Okonkwo"; nobody's name has a number in it.
const guardianNameRegex = /^[^0-9]+$/;
const guardianNameMessage = "Name cannot contain numbers";

export const becomeMemberSchema = z
  .object({
    // --- the household address, shared by every child ---
    city: z
      .string()
      .min(1, "City is required")
      .max(30, "City cannot exceed 30 characters")
      .regex(/^[a-zA-Z\s]+$/, "City can only contain letters and spaces"),
    streetAddress: z
      .string()
      .min(1, "Street address is required")
      .max(50, "Street address cannot exceed 50 characters"),
    zipCode: z
      .string()
      .min(1, "Zip code is required")
      .regex(/^\d{5}$/, "Zip code must be exactly 5 digits")
      .max(5, "Zip code must be exactly 5 digits"),

    // --- the parents/guardians ---
    fatherName: z
      .string()
      .max(100, "Name is too long")
      .regex(guardianNameRegex, guardianNameMessage)
      .optional()
      .or(z.literal("")),
    motherName: z
      .string()
      .max(100, "Name is too long")
      .regex(guardianNameRegex, guardianNameMessage)
      .optional()
      .or(z.literal("")),
    fatherPhone: z
      .string()
      .regex(
        /^(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})?$/,
        "Please enter a valid 10-digit phone number",
      )
      .max(14, "Phone number is too long")
      .optional()
      .or(z.literal("")),
    motherPhone: z
      .string()
      .regex(
        /^(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})?$/,
        "Please enter a valid 10-digit phone number",
      )
      .max(14, "Phone number is too long")
      .optional()
      .or(z.literal("")),
    fatherEmail: z
      .string()
      .email("Invalid email address")
      .max(150, "Email is too long")
      .optional()
      .or(z.literal("")),
    motherEmail: z
      .string()
      .email("Invalid email address")
      .max(150, "Email is too long")
      .optional()
      .or(z.literal("")),
    primaryEmail: z.enum(["father", "mother"]),

    password: passwordFieldSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((value) => value === true, {
      message: "You must agree to the terms",
    }),

    // --- the players ---
    children: z.array(childSchema).min(1, "Add at least one player profile"),
  })
  /**
   * Only the primary guardian is required, and they must be complete: their
   * name, phone and email are the account's.
   *
   * The other guardian is entirely optional — none, one, two or all three
   * fields are all fine. They are a contact detail, not an account.
   */
  .superRefine((data, ctx) => {
    const primary =
      data.primaryEmail === "father"
        ? {
            label: "Father's",
            name: data.fatherName,
            phone: data.fatherPhone,
            email: data.fatherEmail,
            paths: ["fatherName", "fatherPhone", "fatherEmail"] as const,
          }
        : {
            label: "Mother's",
            name: data.motherName,
            phone: data.motherPhone,
            email: data.motherEmail,
            paths: ["motherName", "motherPhone", "motherEmail"] as const,
          };

    const required = [
      { value: primary.name, field: "name", path: primary.paths[0] },
      { value: primary.phone, field: "phone", path: primary.paths[1] },
      { value: primary.email, field: "email", path: primary.paths[2] },
    ];

    for (const { value, field, path } of required) {
      if (!value) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${primary.label} ${field} is required`,
          path: [path],
        });
      }
    }
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type BecomeMemberFormData = z.infer<typeof becomeMemberSchema>;
