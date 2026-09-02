"use client";

import { useState } from "react";
import type { UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useEditProfile } from "@/features/dashboard/hooks/use-edit-profile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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



function FormField({
  id,
  label,
  type = "text",
  error,
  disabled,
  register,
  onChange,
  maxLength,
}: {
  id: keyof EditProfileFields;
  label: string;
  type?: string;
  error?: string;
  disabled?: boolean;
  register: UseFormRegister<EditProfileFields>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
}) {
  const registered = register(id);
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <label htmlFor={id} className={`text-sm font-medium capitalize leading-[19px] text-[#181818] ${disabled ? "opacity-50" : ""}`}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        disabled={disabled}
        maxLength={maxLength}
        className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50`}
        {...registered}
        onChange={(e) => {
          if (onChange) onChange(e);
          registered.onChange(e);
        }}
      />
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
  const { form, onSubmit } = useEditProfile({ profile, onSave, onClose });
  console.log(profile)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open && !isUpdating) onClose(); }}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] w-full max-w-[759px] flex-col overflow-y-auto rounded-[12px] px-6 py-[60px] sm:px-10 border-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] !outline-none"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%), #F7F6FF",
        }}
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


          </div>

          <form onSubmit={handleSubmit(onSubmit as any)} className="flex w-full flex-col gap-[43px]">
        {/* Locked while the request is in flight: disabling only the
            submit button leaves every field editable after the values
            have already been sent. `contents` keeps the fieldset out
            of the layout. */}
        <fieldset disabled={isUpdating} className="contents">
            <div className="flex flex-col gap-6">
              <FormSection title="Personal Information">
                <FormRow>
                  <FormField
                    id="firstName"
                    label="First Name"
                    error={errors.firstName?.message}
                    disabled={isUpdating}
                    register={register}
                    maxLength={50}
                  />
                  <FormField
                    id="lastName"
                    label="Last Name"
                    error={errors.lastName?.message}
                    disabled={isUpdating}
                    register={register}
                    maxLength={50}
                  />
                </FormRow>
                <FormRow>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <label htmlFor="gender" className={`text-sm font-medium capitalize leading-[19px] text-[#181818] ${isUpdating ? "opacity-50" : ""}`}>
                      Gender
                    </label>
                    <Controller
                      control={control}
                      name="gender"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""} disabled={isUpdating}>
                          <SelectTrigger id="gender" className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50`}>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.gender && <p className="text-xs text-red-600">{errors.gender.message as string}</p>}
                  </div>
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
                  <div className="flex w-full flex-col gap-2 sm:w-[309px]">
                    <label htmlFor="grade" className={`text-sm font-medium capitalize leading-[19px] text-[#181818] ${isUpdating ? "opacity-50" : ""}`}>
                      Grade
                    </label>
                    <Controller
                      control={control}
                      name="grade"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""} disabled={isUpdating}>
                          <SelectTrigger id="grade" className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50`}>
                            <SelectValue placeholder="Select Grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="K">K</SelectItem>
                            {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((g) => (
                              <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.grade && <p className="text-xs text-red-600">{errors.grade.message as string}</p>}
                  </div>
                </FormRow>
              </FormSection>

              <FormSection title="Address">
                <FormRow>
                  <FormField
                    id="city"
                    label="City"
                    error={errors.city?.message}
                    disabled={isUpdating}
                    register={register}
                    maxLength={100}
                  />
                </FormRow>
              </FormSection>

              <FormSection title="Parent Information">
                <FormRow>
                  <FormField
                    id="fatherName"
                    label="Father's Full Name"
                    error={errors.fatherName?.message}
                    disabled={isUpdating}
                    register={register}
                    maxLength={100}
                  />
                  <FormField
                    id="motherName"
                    label="Mother's Full Name"
                    error={errors?.motherName?.message}
                    disabled={isUpdating}
                    register={register}
                    maxLength={100}
                  />
                </FormRow>
                <FormRow>
                  <FormField
                    id="fatherPhone"
                    label="Father's Phone"
                    error={errors.fatherPhone?.message}
                    disabled={isUpdating}
                    register={register}
                    onChange={(e) => {
                      const value = e.target.value;
                      const phoneNumber = value.replace(/[^\d]/g, "");
                      if (phoneNumber.length < 4) {
                        e.target.value = phoneNumber;
                      } else if (phoneNumber.length < 7) {
                        e.target.value = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
                      } else {
                        e.target.value = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
                      }
                    }}
                  />
                  <FormField
                    id="motherPhone"
                    label="Mother's Phone"
                    error={errors.motherPhone?.message}
                    disabled={isUpdating}
                    register={register}
                    onChange={(e) => {
                      const value = e.target.value;
                      const phoneNumber = value.replace(/[^\d]/g, "");
                      if (phoneNumber.length < 4) {
                        e.target.value = phoneNumber;
                      } else if (phoneNumber.length < 7) {
                        e.target.value = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
                      } else {
                        e.target.value = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
                      }
                    }}
                  />
                </FormRow>
                <FormRow>
                  <FormField
                    id="fatherEmail"
                    label="Father's Email"
                    type="email"
                    error={errors.fatherEmail?.message}
                    disabled={isUpdating}
                    register={register}
                  />
                  <FormField
                    id="motherEmail"
                    label="Mother's Email"
                    type="email"
                    error={errors.motherEmail?.message}
                    disabled={isUpdating}
                    register={register}
                  />
                </FormRow>
              </FormSection>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Profile"}
            </button>
          </fieldset>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
