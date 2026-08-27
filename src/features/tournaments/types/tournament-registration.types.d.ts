interface TournamentRegistrationFields {
  playerFirstName: string;
  playerLastName: string;
  grade: string;
  teamName: string;
  city: string;
  division: string;
  parentFirstName: string;
  parentLastName: string;
  parentPhone: string;
  parentEmail: string;
}

interface TournamentRegistrationTarget {
  id: string;
  title: string;
  location: string;
  date: string;
  price: string;
  divisions: {
    _id: string;
    /** The name the admin gave the division. */
    name?: string;
    /** Same value as `name`; kept because the API returns both. */
    label?: string;
    /** The rules behind the name, e.g. "Grades K-3 - Rating under 600". */
    criteria?: string | null;
    gradeMin?: number;
    gradeMax?: number;
    rating?: number | null;
    condition?: string | null;
  }[];
}

type TournamentRegistrationStep = "registration" | "payment" | "success" | "registration-success";
