import { z } from "zod";

const divisionOptions = ["U8", "U10", "U12", "U14", "U16", "U18", "Open"] as const;

export const tournamentRegistrationSchema = z.object({
  playerFirstName: z.string().min(1, "First name is required"),
  playerLastName: z.string().min(1, "Last name is required"),
  grade: z.string().min(1, "Grade is required"),
  teamName: z.string().min(1, "Team name is required"),
  city: z.string().min(1, "City is required"),
  division: z.string().min(1, "Division is required"),
  parentFirstName: z.string().min(1, "Parent first name is required"),
  parentLastName: z.string().min(1, "Parent last name is required"),
  parentPhone: z.string().min(1, "Phone number is required"),
  parentEmail: z.string().email("Enter a valid email"),
});

export { divisionOptions };
