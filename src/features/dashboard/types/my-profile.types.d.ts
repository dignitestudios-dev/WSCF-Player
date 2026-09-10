interface MyProfileParentInfo {
  name: string;
  email: string;
  phone: string;
}

interface MyProfile {
  name: string;
  /**
   * The child's name as the database stores it. `name` above is the two joined
   * for display; editing must use these, because splitting the joined string
   * back apart guesses wrong the moment a first or last name contains a space.
   */
  firstName: string;
  lastName: string;
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
  /**
   * Where this player sits in the admin's rating queue. `pending` means nobody
   * has looked them up yet, which is different from a confirmed 0.
   */
  ratingStatus?: "pending" | "assigned" | "unrated";
  enrolledTournaments: number;
  historyScore: string;
  /** The primary guardian, for the read-only profile card. */
  parent: MyProfileParentInfo;
  /**
   * Both guardians as stored, kept apart. The edit form has a row for each, so
   * it cannot use `parent` above — that collapses to whichever is primary, and
   * loading a mother into the father's row is how her details end up written
   * to the wrong record.
   */
  parents: {
    father?: MyProfileParentInfo;
    mother?: MyProfileParentInfo;
  };
}
