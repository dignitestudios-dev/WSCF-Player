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
}

interface RegisterMemberParent {
  name: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

interface RegisterMemberPayload {
  name: string;
  grade: string;
  dob: string;
  city: string;
  streetAddress: string;
  zipCode: number;
  password: string;
  parents: {
    father: RegisterMemberParent;
    mother: RegisterMemberParent;
  };
}

interface RegisterMemberResponse {
  message?: string;
  apiMessage?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
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
