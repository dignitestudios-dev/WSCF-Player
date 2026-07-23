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
}

type TournamentRegistrationStep = "registration" | "payment" | "success" | "registration-success";
