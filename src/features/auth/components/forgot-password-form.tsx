"use client";

import { useForgotPassword } from "@/features/auth/hooks/use-forgot-password";
import { ForgotPasswordIcon } from "@/features/auth/components/forgot-password-icons";

export default function ForgotPasswordForm() {
  const {
    form,
    onSubmit,
    isPending,
    error,
    sentTo,
    needsVerification,
    sendVerificationLink,
    isSendingVerification,
    verificationSentTo,
    tryAnotherEmail,
  } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  if (sentTo) {
    return (
      <div className="flex w-full flex-col items-center gap-[26px] text-center">
        <div className="flex h-[146px] w-[146px] items-center justify-center rounded-full bg-[rgba(8,63,146,0.1)]">
          <ForgotPasswordIcon />
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-[28px] font-semibold leading-9 tracking-[-0.008em] text-[#083F92]">
            Check Your Email
          </h1>
          <p className="text-base leading-[22px] text-[#565656]">
            We sent a password reset link to{" "}
            <strong className="break-all text-[#181818]">{sentTo}</strong>. It
            works once and expires in 1 hour.
          </p>
        </div>
        <button
          type="button"
          onClick={tryAnotherEmail}
          className="text-sm font-semibold text-[#083F92] underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-[26px]">
      <div className="flex h-[146px] w-[146px] items-center justify-center rounded-full bg-[rgba(8,63,146,0.1)]">
        <ForgotPasswordIcon />
      </div>

      <div className="flex w-full flex-col gap-[33px]">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-[32px] font-semibold capitalize leading-[43px] tracking-[-0.008em] text-[#083F92]">
            Forgot Password
          </h1>
          <p className="text-base leading-[22px] tracking-[-0.014em] text-[#565656]">
            Enter your email and we will send you a link to choose a new
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <fieldset disabled={isPending} className="flex w-full flex-col gap-[26px] border-0 p-0 m-0">
            {error && (
              <p className="text-center text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            {needsVerification &&
              (verificationSentTo ? (
                <p
                  className="text-center text-sm text-[#083F92]"
                  role="status"
                >
                  If that account exists, we sent a verification link to{" "}
                  <strong className="break-all">{verificationSentTo}</strong>.
                  Open it, then come back to reset your password.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={sendVerificationLink}
                  disabled={isSendingVerification}
                  className="h-11 w-full rounded-[24px] border border-[#083F92] bg-white text-sm font-semibold text-[#083F92] transition-colors hover:bg-[#F5F7FB] disabled:opacity-60"
                >
                  {isSendingVerification
                    ? "Sending..."
                    : "Send me a verification link"}
                </button>
              ))}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium capitalize leading-[19px] text-[#181818]"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                maxLength={254}
                placeholder="designer@dignitestudios.com"
                className="h-11 w-full rounded-[24px] border border-[#3D3775] bg-white px-4 text-sm text-[#181818] outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-[#083F92]/15"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-0.5 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-60"
            >
              {isPending ? "Sending..." : "Submit"}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
