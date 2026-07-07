"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon } from "@/features/auth/components/set-new-password-icons";
import { setNewPasswordSchema } from "@/features/auth/schemas/set-new-password.schema";
import { useAuth } from "@/hooks/use-auth";

interface DeleteAccountPasswordModalProps {
  onClose: () => void;
}

function PasswordField({
  id,
  label,
  visible,
  onToggle,
  error,
  register,
}: {
  id: keyof SetNewPasswordFields;
  label: string;
  visible: boolean;
  onToggle: () => void;
  error?: string;
  register: ReturnType<typeof useForm<SetNewPasswordFields>>["register"];
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

export default function DeleteAccountPasswordModal({ onClose }: DeleteAccountPasswordModalProps) {
  const { logout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SetNewPasswordFields>({
    resolver: zodResolver(setNewPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function onSubmit() {
    logout();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex w-full max-w-[515px] flex-col gap-[26px] rounded-[12px] p-[60px]"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%), #FFFFFF",
        }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-password-title"
      >
        <h2
          id="delete-account-password-title"
          className="text-center text-[32px] font-bold capitalize leading-[43px] tracking-[-0.018em] text-[#181818]"
        >
          Add Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[33px]">
          <PasswordField
            id="password"
            label="Password"
            visible={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
            error={errors.password?.message}
            register={register}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm Password"
            visible={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((prev) => !prev)}
            error={errors.confirmPassword?.message}
            register={register}
          />

          <button
            type="submit"
            className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875]"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
