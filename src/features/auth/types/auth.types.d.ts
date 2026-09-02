interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  sigma?: string;
}

interface RegisterMemberParent {
  name: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

/** One child on the account. A player is a child, never the account itself. */
interface RegisterMemberChild {
  firstName: string;
  lastName: string;
  gender: string;
  grade: string;
  dob: string;
}

interface RegisterMemberPayload {
  password: string;
  address: {
    city: string;
    streetAddress: string;
    zipCode: number;
  };
  parents: {
    father?: RegisterMemberParent;
    mother?: RegisterMemberParent;
  };
  children: RegisterMemberChild[];
}

interface RegisterMemberResponse {
  message?: string;
  apiMessage?: string;
}

/**
 * A player: one child on a parent's account. Everything the app shows —
 * dashboard, history, notifications, tournament entries — is scoped to one of
 * these at a time.
 */
interface PlayerChild {
  _id: string;
  firstName: string;
  lastName: string;
  name: string;
  membershipId?: string;
  grade?: string;
  gender?: string;
  dob?: string;
  rating?: number;
  /**
   * Where this player sits in the admin's rating queue. `pending` means nobody
   * has looked them up yet — different from a confirmed rating of 0.
   */
  ratingStatus?: "pending" | "assigned" | "unrated";
  masterFileChecked?: boolean;
  masterPlayerId?: string | null;
  /** Barring is per player: a sibling can be active alongside a barred one. */
  status?: "active" | "inactive";
  deactivationReason?: string | null;
  isActive?: boolean;
  team?: { _id: string; name: string } | null;
  membership?: {
    _id: string;
    status: "active" | "expired" | "cancelled";
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
  } | null;
  hasActiveMembership?: boolean;
}

/** The signed-in account. The user is the parent, not a player. */
interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: {
    city?: string | null;
    streetAddress?: string | null;
    zipCode?: number | null;
  };
  parents?: {
    father?: RegisterMemberParent;
    mother?: RegisterMemberParent;
  };
  role?: string;
  status?: string;
  isEmailVerified?: boolean;

  children?: PlayerChild[];
  childrenCount?: number;
  /** A child still has no active membership, so the account owes money. */
  needsMembershipPayment?: boolean;
  /** A child has not been through the master players file lookup yet. */
  needsMasterFileCheck?: boolean;
}

interface LoginResponse extends User {
  accessToken: string;
  refreshToken: string;
  apiMessage?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

interface LoginActionItem {
  id: string;
  label: string;
  href?: string;
  action?: "member-login";
}

interface MemberLoginCredentials {
  email: string;
  password: string;
}

interface ForgotPasswordFormData {
  email: string;
}

interface ResendOtpPayload {
  email: string;
  type: "email";
  // Chooses the wording of the mail. The same code is issued either way.
  purpose?: "verify" | "reset";
}

interface VerifyOtpFormData {
  email: string;
  otp: string;
}

interface VerifyOtpResponse {
  message?: string;
  apiMessage?: string;
  accessToken?: string;
  user?: User;
}

interface SetNewPasswordFormData {
  email: string;
  password: string;
  confirmPassword: string;
  token?: string;
}

interface SetNewPasswordFields {
  password: string;
  confirmPassword: string;
}

interface ChangePasswordFields {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
