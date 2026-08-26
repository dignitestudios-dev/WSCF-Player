interface MyProfileParentInfo {
  name: string;
  email: string;
  phone: string;
}

interface MyProfile {
  name: string;
  userId: string;
  gender: string;
  sigma?: string;
  team: string;
  city: string;
  dateOfBirth: string;
  email?: string;
  grade?: string;
  division?: string;
  avatarUrl: string;
  currentRating: number;
  enrolledTournaments: number;
  historyScore: string;
  parent: MyProfileParentInfo;
}
