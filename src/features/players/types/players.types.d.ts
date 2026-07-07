interface PlayerTournament {
  id: string;
  name: string;
  date: string;
  rating: string;
  ratingChange: string;
}

interface PlayerProfile {
  id: string;
  name: string;
  userId: string;
  gender: string;
  school: string;
  city: string;
  dateOfBirth: string;
  currentRating: number;
  status: string;
  avatarUrl: string;
  tournaments: PlayerTournament[];
}
