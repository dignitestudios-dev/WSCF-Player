interface TournamentDetailsPlayer {
  id: string;
  userId: string;
  name: string;
  rating: number;
}

interface TournamentDetails {
  id: string;
  title: string;
  location: string;
  date: string;
  registeredCount: number;
  players: TournamentDetailsPlayer[];
}
