import { useMutation } from "@tanstack/react-query";
import {
  forgotPassword,
  loginUser,
  registerMember,
  registerUser,
  resendVerificationLink,
  sendVerificationLink,
  verifyEmailLink,
  changeEmail,
  changePassword,
  setNewPassword,
  signInMember,
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

export function useVerifyEmailLinkMutation() {
  return useMutation({
    mutationFn: (token: string) => verifyEmailLink(token),
  });
}

export function useSendVerificationLinkMutation() {
  return useMutation({
    mutationFn: () => sendVerificationLink(),
  });
}

export function useResendVerificationLinkMutation() {
  return useMutation({
    mutationFn: (payload: ResendVerificationPayload) =>
      resendVerificationLink(payload),
  });
}

export function useChangeEmailMutation() {
  return useMutation({
    mutationFn: (payload: ChangeEmailPayload) => changeEmail(payload),
  });
}

export function useSetNewPasswordMutation() {
  return useMutation({
    mutationFn: (payload: SetNewPasswordFormData) => setNewPassword(payload),
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  });
}
