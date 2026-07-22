"use client";

import Image from "next/image";
import {
  EyeIcon,
} from "@/features/auth/components/set-new-password-icons";
import { useSetNewPassword } from "@/features/auth/hooks/use-set-new-password";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function SetNewPasswordForm() {
  const {
    form,
    onSubmit,
    isPending,
    error,
    showPassword,
    showConfirmPassword,
    togglePassword,
    toggleConfirmPassword,
    isSuccessModalOpen,
    closeSuccessModal,
    handleSuccessContinue,
  } = useSetNewPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="flex w-full flex-col items-center gap-[26px]">
      <div className="flex h-[146px] w-[146px] items-center justify-center rounded-full">
        <Image
          src="/images/password.png"
          alt="Set new password"
          width={200}
          height={200}
          className="object-contain"
        />
      </div>

      <div className="flex w-full flex-col gap-[33px]">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-[36px] font-semibold capitalize leading-[49px] tracking-[-0.008em] text-[#083F92]">
            Set New Password
          </h1>
          <p className="text-base leading-[22px] tracking-[-0.014em] text-[#565656]">
            Enter new password to Continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[26px]">
          {error && (
            <p className="text-center text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium capitalize leading-[19px] text-[#181818]"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="h-11 w-full rounded-[24px] border border-[#3D3775] bg-white px-4 pr-12 text-sm text-[#181818] outline-none focus:ring-2 focus:ring-[#083F92]/15"
                {...register("password")}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon hidden={!showPassword} />
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium capitalize leading-[19px] text-[#181818]"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="h-11 w-full rounded-[24px] border border-[#3D3775] bg-white px-4 pr-12 text-sm text-[#181818] outline-none focus:ring-2 focus:ring-[#083F92]/15"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={toggleConfirmPassword}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon hidden={!showConfirmPassword} />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Submit"}
          </button>
        </form>
      </div>

      {isSuccessModalOpen && (
        <Dialog open={true} onOpenChange={(open) => { if (!open) closeSuccessModal(); }}>
          <DialogContent 
            showCloseButton={false}
            className="flex w-full max-w-[482px] flex-col items-center gap-[25px] rounded-xl bg-white px-4 py-[26px] border-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] !outline-none"
          >
            <div className="flex h-[107px] w-[107px] items-center justify-center rounded-full bg-[#083F92]">
              <svg width="40" height="30" viewBox="0 0 40 30" fill="none" aria-hidden="true">
                <path
                  d="M4 16L14 26L36 4"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="w-full text-center">
              <h2
                id="password-updated-title"
                className="text-2xl font-semibold leading-8 text-[#212121]"
              >
                Password Updated!
              </h2>
              <p className="mt-2 text-base leading-[22px] text-[#565656]">
                Your password has been reset successfully
              </p>
            </div>

            <button
              type="button"
              onClick={handleSuccessContinue}
              className="h-12 w-full max-w-[420px] rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875]"
            >
              Continue
            </button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
