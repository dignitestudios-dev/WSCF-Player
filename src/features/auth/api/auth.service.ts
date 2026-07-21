import axiosInstance from "@/lib/axios";
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

function mapOtpVerifiedUser(
  payload: Record<string, unknown>,
  fallbackEmail: string
): User {
  const email = String(payload.email ?? fallbackEmail);
  const fullName = String(payload.name ?? "");
  const [firstName, ...lastNameParts] = fullName.trim().split(" ");

  return {
    id: Number(payload.id ?? 0),
    username: email.split("@")[0] || fullName || "member",
    email,
    firstName: firstName || "",
    lastName: lastNameParts.join(" ") || "",
    gender: String(payload.gender ?? ""),
    image: String(payload.image ?? payload.avatar ?? ""),
  };
}

function mapSignInUser(
  payload: Record<string, unknown>,
  fallbackEmail: string
): User {
  const email = String(payload.email ?? fallbackEmail);
  const username = String(payload.username ?? email.split("@")[0] ?? "member");

  return {
    id: Number(payload.id ?? 0),
    username,
    email,
    firstName: String(payload.firstName ?? payload.first_name ?? ""),
    lastName: String(payload.lastName ?? payload.last_name ?? ""),
    gender: String(payload.gender ?? ""),
    image: String(payload.image ?? payload.avatar ?? ""),
  };
}

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

  return { message: data.message, apiMessage: data.message };
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
    throw new Error(data.message ?? "Failed to send OTP");
  }

  return { message: data.message ?? "OTP Sent Successfully" };
}

export async function verifyOtp(
  payload: VerifyOtpFormData
): Promise<VerifyOtpResponse> {
  const { data } = await axiosInstance.post<SignInApiResponse>(
    "/auth/verify-otp",
    {
      email: payload.email,
      otp: payload.otp,
      type: "email",
    }
  );

  if (data.success === false) {
    throw new Error(data.message ?? "OTP verification failed");
  }

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
      ? mapOtpVerifiedUser(userPayload, payload.email)
      : undefined,
  };
}

export async function resendOtp(
  payload: ResendOtpPayload
): Promise<{ message?: string; apiMessage?: string }> {
  const { data } = await axiosInstance.post<SignInApiResponse>(
    "/auth/resend-otp",
    payload
  );

  if (data.success === false) {
    throw new Error(data.message ?? "Failed to resend OTP");
  }

  return { message: data.message, apiMessage: data.message };
}

export async function setNewPassword(
  payload: SetNewPasswordFormData
): Promise<{ message: string }> {
  const { data } = await axiosInstance.post<SignInApiResponse>(
    "/auth/reset-password",
    { password: payload.password },
    {
      headers: {
        ...(payload.token ? { Authorization: `Bearer ${payload.token}` } : {}),
      },
    }
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

export interface UpdateUserProfilePayload {
  name?: string;
  division?: string;
  grade?: string;
  parentName?: string;
  parentNumber?: string;
}

export async function updateProfile(payload: UpdateUserProfilePayload) {
  const { data } = await axiosInstance.put("/user/profile", payload);
  return data;
}

