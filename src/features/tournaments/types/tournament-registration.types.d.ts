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
    type: string;
    divisionName?: string;
    rating?: number;
    condition?: string;
  }[];
}

type TournamentRegistrationStep = "registration" | "payment" | "success" | "registration-success";
