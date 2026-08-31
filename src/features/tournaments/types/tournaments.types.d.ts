interface TournamentApiData {
  _id: string;
  title: string;
  date: string;
  location: string;
  entryFee: number;
  divisions: {
    _id: string;
    /** The name the admin gave the division. */
    name?: string;
    /** Same value as `name`; the API returns both. */
    label?: string;
    /** The rules behind the name, e.g. "Grades K-3 - Rating under 600". */
    criteria?: string | null;
    gradeMin?: number;
    gradeMax?: number;
    rating?: number | null;
    condition?: "under" | "above" | null;
  }[];
  status: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PaginationData {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

interface TournamentsApiResponse {
  success: boolean;
  message: string;
  data: {
    tournaments: TournamentApiData[];
  };
  pagination: PaginationData;
}

interface GetTournamentsParams {
  page: number;
  limit: number;
  search?: string;
  status?: "upcoming" | "ongoing" | "completed" | "cancelled";
}

interface TournamentParticipantApiData {
  _id: string;
  enrolledAt: string;
  user: {
    _id: string;
    name: string;
  };
  team?: {
    _id: string;
    name: string;
  };
  playerProfile?: {
    _id: string;
    grade: string;
    rating: number;
    membershipId: string;
  };
}

interface TournamentParticipantsApiResponse {
  success: boolean;
  message: string;
  data: {
    participants: TournamentParticipantApiData[];
  };
  pagination: PaginationData;
}

interface TournamentDetailsApiResponse {
  success: boolean;
  message: string;
  data: {
    tournament: TournamentApiData;
  };
}

interface EligibleDivisionsApiResponse {
  success: boolean;
  message: string;
  data: {
    divisions: TournamentApiData["divisions"];
  };
}

interface TournamentRegistrationPayload {
  divisionId: string;
  /** Re-checked server-side; a code covering the whole fee skips checkout. */
  couponCode?: string;
  successUrl?: string;
  cancelUrl?: string;
}

interface TournamentRegistrationApiResponse {
  success: boolean;
  message: string;
  data: {
    participant: {
      _id: string;
      tournamentId: string;
      userId: string;
      teamId: string | null;
      paymentStatus: string;
      enrolledAt: string;
    };
    requiresPayment: boolean;
    /** PayPal's approval link. Present only when requiresPayment is true. */
    checkoutUrl?: string;
    /** PayPal order id, echoed back to the success page as ?token=. */
    orderId?: string;
  };
}
