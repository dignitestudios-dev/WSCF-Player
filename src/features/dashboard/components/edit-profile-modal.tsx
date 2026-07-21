"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { UseFormRegister } from "react-hook-form";
import { useEditProfile } from "@/features/dashboard/hooks/use-edit-profile";

interface EditProfileModalProps {
  profile: MyProfile;
  onClose: () => void;
  onSave: (values: EditProfileFields) => void;
  isUpdating?: boolean;
}

const inputClassName =
  "h-11 w-full rounded-[24px] border border-[#3D3775] bg-white px-4 text-sm text-[#181818] outline-none placeholder:text-[#181818]/60 focus:ring-2 focus:ring-[#083F92]/15";

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

function ImagePlaceholderIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="23" height="23" rx="2" stroke="#181818" strokeWidth="1.5" />
      <circle cx="10.5" cy="10.5" r="2" stroke="#181818" strokeWidth="1.5" />
      <path d="M4.5 19.5L10 14L14 18L19 13L25.5 19.5" stroke="#181818" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function EditAvatarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z"
        stroke="#28303F"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FormField({
  id,
  label,
  type = "text",
  error,
  disabled,
  register,
}: {
  id: keyof EditProfileFields;
  label: string;
  type?: string;
  error?: string;
  disabled?: boolean;
  register: UseFormRegister<EditProfileFields>;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <label htmlFor={id} className={`text-sm font-medium capitalize leading-[19px] text-[#181818] ${disabled ? "opacity-50" : ""}`}>
        {label}
      </label>
      <input id={id} type={type} disabled={disabled} className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50`} {...register(id)} />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      <h3 className="text-base font-bold capitalize leading-[19px] tracking-[-0.018em] text-[#181818]">
        {title}
      </h3>
      <div className="flex flex-col gap-[23px]">{children}</div>
    </div>
  );
}

function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-[23px] sm:flex-row sm:gap-10">{children}</div>;
}

export default function EditProfileModal({ profile, isUpdating, onClose, onSave }: EditProfileModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { form, onSubmit } = useEditProfile({ profile, onSave, onClose });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isUpdating) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose, isUpdating]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={() => {
        if (!isUpdating) onClose();
      }}
      role="presentation"
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-[759px] flex-col overflow-y-auto rounded-[12px] px-6 py-[60px] sm:px-10"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%), #F7F6FF",
        }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isUpdating}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center text-[#181818] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className="mx-auto flex w-full max-w-[674px] flex-col items-center gap-[26px]">
          <div className="flex flex-col items-center gap-[23px]">
            <h2
              id="edit-profile-title"
              className="text-center text-[32px] font-bold capitalize leading-[43px] tracking-[-0.018em] text-[#181818]"
            >
              Edit Profile
            </h2>

            <div className="relative">
              <div className="relative h-[110px] w-[110px] overflow-hidden rounded-full bg-[#F9FAFA]">
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    sizes="110px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImagePlaceholderIcon />
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                aria-hidden="true"
              />
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[2px_8px_12px_rgba(0,0,0,0.06)] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Change profile photo"
              >
                <EditAvatarIcon />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-[43px]">
            <div className="flex flex-col gap-6">
              <FormSection title="Personal Information">
                <FormRow>
                  <FormField
                    id="fullName"
                    label="Full Name"
                    error={errors.fullName?.message}
                    disabled={isUpdating}
                    register={register}
                  />
                  <FormField
                    id="division"
                    label="Division"
                    error={errors.division?.message}
                    disabled={isUpdating}
                    register={register}
                  />
                </FormRow>
                <FormRow>
                  <FormField
                    id="email"
                    label="Email"
                    type="email"
                    error={errors.email?.message}
                    disabled={isUpdating}
                    register={register}
                  />
                  <FormField
                    id="grade"
                    label="Grade"
                    error={errors.grade?.message}
                    disabled={isUpdating}
                    register={register}
                  />
                </FormRow>
              </FormSection>

              <FormSection title="Parent Information">
                <FormRow>
                  <FormField
                    id="parentFullName"
                    label="Full Name"
                    error={errors.parentFullName?.message}
                    disabled={isUpdating}
                    register={register}
                  />
                  <FormField
                    id="parentPhone"
                    label="Phone"
                    error={errors.parentPhone?.message}
                    disabled={isUpdating}
                    register={register}
                  />
                </FormRow>
                <div className="flex flex-col gap-[23px] sm:flex-row sm:gap-10">
                  <FormField
                    id="parentEmail"
                    label="Email"
                    type="email"
                    error={errors.parentEmail?.message}
                    disabled={isUpdating}
                    register={register}
                  />
                </div>
              </FormSection>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
