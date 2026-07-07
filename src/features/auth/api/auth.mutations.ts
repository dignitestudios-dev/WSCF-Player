import { useMutation } from "@tanstack/react-query";
import {
  forgotPassword,
  loginUser,
  registerMember,
  registerUser,
  resendOtp,
  setNewPassword,
  signInMember,
  verifyOtp,
} from "@/features/auth/api/auth.service";
import type { BecomeMemberFormData } from "@/features/auth/schemas/become-member.schema";

export function useBecomeMemberMutation() {
  return useMutation({
    mutationFn: (payload: BecomeMemberFormData) => registerMember(payload),
  });
}

export function useMemberLoginMutation() {
  return useMutation({
    mutationFn: (credentials: MemberLoginCredentials) =>
      signInMember(credentials),
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterFormData) => registerUser(payload),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordFormData) => forgotPassword(payload),
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: (payload: VerifyOtpFormData) => verifyOtp(payload),
  });
}

export function useResendOtpMutation() {
  return useMutation({
    mutationFn: (payload: ResendOtpPayload) => resendOtp(payload),
  });
}

export function useSetNewPasswordMutation() {
  return useMutation({
    mutationFn: (payload: SetNewPasswordFormData) => setNewPassword(payload),
  });
}
