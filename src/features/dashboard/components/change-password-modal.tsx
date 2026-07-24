"use client";

import type { UseFormRegister } from "react-hook-form";
import { EyeIcon } from "@/features/auth/components/set-new-password-icons";
import PasswordUpdatedModal from "@/features/dashboard/components/password-updated-modal";
import { useChangePassword } from "@/features/dashboard/hooks/use-change-password";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ChangePasswordModalProps {
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PasswordField({
  id,
  label,
  visible,
  onToggle,
  error,
  register,
}: {
  id: keyof ChangePasswordFields;
  label: string;
  visible: boolean;
  onToggle: () => void;
  error?: string;
  register: UseFormRegister<ChangePasswordFields>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium capitalize leading-[19px] text-[#181818]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className="h-11 w-full rounded-[24px] border border-[#3D3775] bg-white px-4 pr-12 text-sm text-[#181818] outline-none focus:ring-2 focus:ring-[#083F92]/15"
          {...register(id)}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <EyeIcon hidden={!visible} />
        </button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const {
    form,
    onSubmit,
    isPending,
    error,
    showCurrentPassword,
    showPassword,
    showConfirmPassword,
    toggleCurrentPassword,
    togglePassword,
    toggleConfirmPassword,
    isSuccessOpen,
    closeSuccess,
  } = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  function handleSuccessClose() {
    closeSuccess();
    onClose();
  }

  return (
    <>
      <Dialog open={!isSuccessOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent 
          showCloseButton={false}
          className="w-full max-w-[588px] rounded-[12px] px-[60px] pb-[60px] pt-[60px] border-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] !outline-none"
          style={{
            background:
              "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%), #FFFFFF",
          }}
        >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center text-[#181818]"
              aria-label="Close"
            >
              <CloseIcon />
            </button>

            <h2
              id="change-password-title"
              className="mb-1 text-center text-[32px] font-bold capitalize leading-[43px] tracking-[-0.018em] text-[#181818]"
            >
              Change Password
            </h2>

            <p className="mb-7 text-base leading-[22px] tracking-[-0.014em] text-[#565656]">
              You must enter current password in order to update password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[33px]">
              {error ? (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              ) : null}

              <PasswordField
                id="currentPassword"
                label="Current Password"
                visible={showCurrentPassword}
                onToggle={toggleCurrentPassword}
                error={errors.currentPassword?.message}
                register={register}
              />

              <PasswordField
                id="password"
                label="Password"
                visible={showPassword}
                onToggle={togglePassword}
                error={errors.password?.message}
                register={register}
              />

              <PasswordField
                id="confirmPassword"
                label="Confirm Password"
                visible={showConfirmPassword}
                onToggle={toggleConfirmPassword}
                error={errors.confirmPassword?.message}
                register={register}
              />

              <button
                type="submit"
                disabled={isPending}
                className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-60"
              >
                {isPending ? "Saving..." : "Submit"}
              </button>
            </form>
          </DialogContent>
      </Dialog>

      {isSuccessOpen ? <PasswordUpdatedModal onClose={handleSuccessClose} /> : null}
    </>
  );
}
