import axiosInstance from "@/lib/axios";
import axios from "axios";
import type { BecomeMemberFormData } from "@/features/auth/schemas/become-member.schema";
import { mapBecomeMemberToRegisterPayload } from "@/features/auth/utils/register-member.mapper";

interface SignInApiResponse {
  success?: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
    user?: Record<string, unknown>;
  };
  user?: Record<string, unknown>;
  id?: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  image?: string;
}

/**
 * The account, as the app holds it.
 *
 * The signed-in person is the parent; the players are the children on
 * `children`. Both entry points — signing in and signing up — return
 * the same shape from the API, so both map through here.
 */
function mapAccount(
  payload: Record<string, unknown>,
  fallbackEmail: string
): User {
  return {
    _id: String(payload._id ?? ""),
    name: String(payload.name ?? ""),
    email: String(payload.email ?? fallbackEmail),
    phone: (payload.phone as string) ?? null,
    address: payload.address as User["address"],
    parents: payload.parents as User["parents"],
    role: payload.role as string | undefined,
    status: payload.status as string | undefined,
    isEmailVerified: Boolean(payload.isEmailVerified),
    children: (payload.children as PlayerChild[]) ?? [],
    childrenCount: Number(payload.childrenCount ?? 0),
    needsMembershipPayment: Boolean(payload.needsMembershipPayment),
    needsMasterFileCheck: Boolean(payload.needsMasterFileCheck),
  };
}

const mapSignInUser = mapAccount;

export async function signInMember(
  credentials: MemberLoginCredentials
): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<SignInApiResponse>(
    "/auth/signin",
    credentials
  );

  if (data.success === false) {
    throw new Error(data.message ?? "Login failed");
  }

  const accessToken =
    data.accessToken ?? data.token ?? data.data?.accessToken ?? data.data?.token;
  const refreshToken = data.refreshToken ?? data.data?.refreshToken ?? "";
  const userPayload = (data.user ?? data.data?.user ?? data) as Record<
    string,
    unknown
  >;

  if (!accessToken) {
    throw new Error(data.message ?? "Invalid login response");
  }

  const user = mapSignInUser(userPayload, credentials.email);

  return {
    ...user,
    accessToken,
    refreshToken,
    apiMessage: data.message,
  };
}

export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<LoginResponse>("/auth/login", {
    ...credentials,
    expiresInMins: 30,
  });
  return data;
}

export async function registerMember(
  formData: BecomeMemberFormData
): Promise<RegisterMemberResponse> {
  const payload = mapBecomeMemberToRegisterPayload(formData);
  const { data } = await axiosInstance.post<SignInApiResponse>(
    "/auth/signup",
    payload
  );

  if (data.success === false) {
    throw new Error(data.message ?? "Registration failed");
  }

  // Signing up signs you in: the account works immediately, and the rest of
  // onboarding (paying for the players) runs behind that session.
  const accessToken =
    data.data?.token ?? data.token ?? data.accessToken ?? data.data?.accessToken;
  const userPayload = (data.data?.user ?? data.user) as
    | Record<string, unknown>
    | undefined;

  return {
    message: data.message,
    apiMessage: data.message,
    accessToken,
    user: userPayload
      ? mapAccount(userPayload, String(userPayload.email ?? ""))
      : undefined,
  };
}

export async function registerUser(
  payload: RegisterFormData
): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<LoginResponse>(
    "/auth/register",
    payload
  );
  return data;
}

export async function forgotPassword(
  payload: ForgotPasswordFormData
): Promise<{ message: string }> {
  const { data } = await axiosInstance.post<SignInApiResponse>(
    "/auth/forgot-password",
    payload
  );

  if (data.success === false) {
    throw new Error(data.message ?? "Failed to send the reset link");
  }

  return {
    message: data.message ?? "We sent a password reset link to your email.",
  };
}

/** Confirms the address from the emailed link. Needs no login. */
export async function verifyEmailLink(
  token: string
): Promise<{ message: string }> {
  const { data } = await axiosInstance.post<SignInApiResponse>(
    "/auth/verify-email-link",
    { token }
  );

  if (data.success === false) {
    throw new Error(data.message ?? "This link is invalid or has expired.");
  }

  return { message: data.message ?? "Your email has been verified." };
}

/** Asks for a verification link for the signed-in parent. */
export async function sendVerificationLink(): Promise<{ message: string }> {
  const { data } = await axiosInstance.post<SignInApiResponse>(
    "/auth/send-verification-link"
  );

  if (data.success === false) {
    throw new Error(data.message ?? "Failed to send the verification link");
  }

  return {
    message: data.message ?? "We sent a verification link to your email.",
  };
}

/** The same, by address, for someone who is not signed in. */
export async function resendVerificationLink(
  payload: ResendVerificationPayload
): Promise<{ message: string }> {
  const { data } = await axiosInstance.post<SignInApiResponse>(
    "/auth/resend-verification-link",
    payload
  );

  if (data.success === false) {
    throw new Error(data.message ?? "Failed to send the verification link");
  }

  return {
    message: data.message ?? "We sent a verification link to your email.",
  };
}

/** Corrects the sign-in email on an account that is not verified yet. */
export async function changeEmail(
  payload: ChangeEmailPayload
): Promise<{ message: string; email: string }> {
  const { data } = await axiosInstance.post<
    SignInApiResponse & { data?: { email?: string } }
  >("/auth/change-email", payload);

  if (data.success === false) {
    throw new Error(data.message ?? "Failed to change your email");
  }

  return {
    message: data.message ?? "Your email was changed.",
    email: data.data?.email ?? payload.email,
  };
}

/** Sets a new password using the emailed link. Needs no login. */
export async function setNewPassword(
  payload: SetNewPasswordFormData
): Promise<{ message: string }> {
  const { data } = await axiosInstance.post<SignInApiResponse>(
    "/auth/reset-password-link",
    { token: payload.token, password: payload.password }
  );

  if (data.success === false) {
    throw new Error(data.message ?? "Failed to reset password");
  }

  return { message: data.message ?? "Password updated successfully" };
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<{ message: string }> {
  const { data } = await axiosInstance.post<SignInApiResponse>(
    "/auth/change-password",
    payload
  );

  if (data.success === false) {
    throw new Error(data.message ?? "Failed to change password");
  }

  return { message: data.message ?? "Password changed successfully" };
}

export async function getMe() {
  const { data } = await axiosInstance.get("/user/me");
  return data;
}

export interface GuardianPayload {
  name?: string;
  phone?: string;
  email?: string;
}

export interface UpdateUserProfilePayload {
  name?: string;
  division?: string;
  grade?: string;
  /** Part of the account's address. The API also takes `address` and `zipCode`. */
  city?: string;
  /**
   * Each guardian under their own key. Prefer this over the older
   * `parentName`/`parentNumber` pair below, which can only ever address
   * whichever guardian is primary — sending an edit to the other one through
   * it silently overwrites the primary instead.
   */
  parents?: {
    father?: GuardianPayload;
    mother?: GuardianPayload;
  };
  /** @deprecated Superseded by `parents`. Still accepted by the API. */
  parentName?: string;
  /** @deprecated Superseded by `parents`. Still accepted by the API. */
  parentNumber?: string;
  profileImage?: string;
}

export async function updateProfile(payload: UpdateUserProfilePayload) {
  const { data } = await axiosInstance.put("/user/profile", payload);
  return data;
}

export interface PresignedUrlPayload {
  fileName: string;
  contentType: string;
  folder: string;
}

export interface PresignedUrlResponse {
  data: {
    uploadUrl: string;
    key: string;
    fileUrl: string;
    expiresIn?: number;
  }
}

export async function getPresignedUrl(payload: PresignedUrlPayload) {
  const { data } = await axiosInstance.post("/files/presigned-url", payload);
  // Support both nested data or flat structure based on common patterns
  return data.data || data;
}

export async function getSecurePresignedUrl(payload: PresignedUrlPayload): Promise<PresignedUrlResponse["data"]> {
  const { data } = await axiosInstance.post("/files/secure-presigned-url", payload);
  return data.data || data;
}

export async function uploadToPresignedUrl(uploadUrl: string, file: File): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
}

export interface UploadProfileImageResponse {
  _id: string;
  key: string;
  url: string;
  mimetype: string;
  size: number;
}

export async function uploadProfileImage(file: File): Promise<UploadProfileImageResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await axiosInstance.post("/files/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return data.data || data;
}
