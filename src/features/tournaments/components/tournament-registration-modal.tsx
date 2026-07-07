"use client";

import { useEffect } from "react";
import type { UseFormRegister } from "react-hook-form";
import { divisionOptions } from "@/features/tournaments/schemas/tournament-registration.schema";

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

function ChevronDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="#130F26"
        strokeWidth="1.5"
        strokeLinecap="round"
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
  register,
}: {
  id: keyof TournamentRegistrationFields;
  label: string;
  type?: string;
  error?: string;
  register: UseFormRegister<TournamentRegistrationFields>;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium capitalize leading-[19px] text-[#181818]">
        {label}
      </label>
      <input id={id} type={type} className={inputClassName} {...register(id)} />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function DivisionField({
  error,
  register,
}: {
  error?: string;
  register: UseFormRegister<TournamentRegistrationFields>;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <label htmlFor="division" className="text-sm font-medium capitalize leading-[19px] text-[#181818]">
        Division
      </label>
      <div className="relative">
        <select
          id="division"
          className={`${inputClassName} appearance-none pr-10`}
          {...register("division")}
        >
          <option value="" disabled>
            Select drop down
          </option>
          {divisionOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <ChevronDownIcon />
        </div>
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-[22px] sm:flex-row">{children}</div>;
}

interface TournamentRegistrationModalProps {
  onClose: () => void;
  onSubmit: () => void;
  register: UseFormRegister<TournamentRegistrationFields>;
  errors: Partial<Record<keyof TournamentRegistrationFields, { message?: string }>>;
  handleSubmit: (callback: () => void) => (event?: React.BaseSyntheticEvent) => void;
}

export default function TournamentRegistrationModal({
  onClose,
  onSubmit,
  register,
  errors,
  handleSubmit,
}: TournamentRegistrationModalProps) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-[626px] flex-col gap-[42px] overflow-y-auto rounded-[12px] bg-white px-6 py-[42px] sm:px-[52px]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tournament-registration-title"
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
          id="tournament-registration-title"
          className="text-center text-[32px] font-semibold leading-[43px] text-[#181818]"
        >
          Tournament Registration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="flex flex-col gap-8">
            <FormRow>
              <FormField
                id="playerFirstName"
                label="Player First Name"
                error={errors.playerFirstName?.message}
                register={register}
              />
              <FormField
                id="playerLastName"
                label="Player Last Name"
                error={errors.playerLastName?.message}
                register={register}
              />
            </FormRow>

            <FormRow>
              <FormField
                id="grade"
                label="Grade"
                error={errors.grade?.message}
                register={register}
              />
              <FormField
                id="teamName"
                label="Team Name"
                error={errors.teamName?.message}
                register={register}
              />
            </FormRow>

            <FormRow>
              <FormField id="city" label="City" error={errors.city?.message} register={register} />
              <DivisionField error={errors.division?.message} register={register} />
            </FormRow>

            <FormRow>
              <FormField
                id="parentFirstName"
                label="Parent/Guardian First Name"
                error={errors.parentFirstName?.message}
                register={register}
              />
              <FormField
                id="parentLastName"
                label="Parent/Guardian Last Name"
                error={errors.parentLastName?.message}
                register={register}
              />
            </FormRow>

            <FormRow>
              <FormField
                id="parentPhone"
                label="Parent/Guardian Phone Number"
                error={errors.parentPhone?.message}
                register={register}
              />
              <FormField
                id="parentEmail"
                label="Parent/Guardian Email Address"
                type="email"
                error={errors.parentEmail?.message}
                register={register}
              />
            </FormRow>
          </div>

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
