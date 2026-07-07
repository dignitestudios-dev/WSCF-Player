interface MyProfileParentInfo {
  name: string;
  email: string;
  phone: string;
}

interface MyProfile {
  name: string;
  userId: string;
  gender: string;
  school: string;
  city: string;
  dateOfBirth: string;
  avatarUrl: string;
  email?: string;
  division?: string;
  grade?: string;
  currentRating: number;
  enrolledTournaments: number;
  historyScore: string;
  parent: MyProfileParentInfo;
}
