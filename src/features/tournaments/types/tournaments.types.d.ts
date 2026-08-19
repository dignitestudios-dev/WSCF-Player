interface TournamentApiData {
  _id: string;
  title: string;
  date: string;
  location: string;
  entryFee: number;
  divisions: {
    _id: string;
    type: "open" | "conditional";
    divisionName?: string;
    rating?: number;
    condition?: "under" | "above";
  }[];
  tournamentDirector: string;
  tournamentHost: string;
  status: string;
  customDropdownOptions?: any[];
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
    teamCode: string;
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

interface FormFieldApiData {
  _id: string;
  fieldName: string;
  fieldType: string; // 'text', 'number', 'dropdown'
  nature: string; // 'mandatory', 'optional'
  minLength: number;
  options: string[];
  isTournamentSpecific: boolean;
}

interface TournamentFormFieldsApiResponse {
  success: boolean;
  message: string;
  data: {
    fields: FormFieldApiData[];
    divisions?: any[];
  };
}

interface TournamentRegistrationPayload {
  registrationData: {
    name: string;
    value: string;
  }[];
  divisionId: string;
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
      registrationData: {
        _id: string;
        name: string;
        value: string;
      }[];
      enrolledAt: string;
    };
    requiresPayment: boolean;
    checkoutUrl?: string;
    sessionId?: string;
  };
}
