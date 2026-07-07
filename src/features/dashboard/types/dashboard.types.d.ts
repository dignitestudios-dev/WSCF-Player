interface DashboardNotification {
  id: string;
  title: string;
  time: string;
  message: string;
  icon: "tournament" | "alert" | "rating";
}

interface DashboardSummary {
  membershipStatus: string;
  validTill: string;
  userId: string;
  currentRating: number;
  lastUpdate: string;
  upcomingCount: number;
}

interface DashboardTournament {
  id: string;
  title: string;
  location: string;
  date: string;
  price: string;
}
