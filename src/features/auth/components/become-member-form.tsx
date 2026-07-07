"use client";

import type { UseFormRegister } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { EyeIcon } from "@/features/auth/components/set-new-password-icons";
import { useBecomeMember } from "@/features/auth/hooks/use-become-member";
import type { BecomeMemberFormData } from "@/features/auth/schemas/become-member.schema";

const inputClassName =
  "h-11 w-full rounded-[24px] border border-[#3D3775] bg-white px-4 text-sm text-[#181818] outline-none placeholder:text-[#181818]/60 focus:ring-2 focus:ring-[#083F92]/15";

function FormField({
  id,
  label,
  type = "text",
  placeholder,
  error,
  register,
}: {
  id: keyof Pick<
    BecomeMemberFormData,
    | "name"
    | "birthDate"
    | "grade"
    | "city"
    | "streetAddress"
    | "zipCode"
    | "fatherName"
    | "motherName"
    | "fatherPhone"
    | "motherPhone"
  >;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register: UseFormRegister<BecomeMemberFormData>;
}) {
  return (
    <div className="flex w-full flex-col gap-2 sm:w-[309px]">
      <label htmlFor={id} className="text-sm font-medium capitalize leading-[19px] text-[#181818]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={inputClassName}
        {...register(id)}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function PasswordField({
  id,
  label,
  show,
  onToggle,
  error,
  register,
}: {
  id: "password" | "confirmPassword";
  label: string;
  show: boolean;
  onToggle: () => void;
  error?: string;
  register: UseFormRegister<BecomeMemberFormData>;
}) {
  return (
    <div className={`flex w-full flex-col gap-2 sm:w-[309px]`}>
      <label htmlFor={id} className="text-sm font-medium capitalize leading-[19px] text-[#181818]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className={`${inputClassName} pr-12`}
          {...register(id)}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2"
          aria-label={show ? "Hide password" : "Show password"}
        >
          <EyeIcon hidden={!show} />
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function ParentEmailField({
  id,
  label,
  primaryValue,
  isPrimary,
  error,
  register,
}: {
  id: "fatherEmail" | "motherEmail";
  label: string;
  primaryValue: "father" | "mother";
  isPrimary: boolean;
  error?: string;
  register: UseFormRegister<BecomeMemberFormData>;
}) {
  const primaryInputId = `primary-email-${primaryValue}`;

  return (
    <div className="w-full sm:w-[309px]">
      <div className="relative">
        <div className="flex flex-col gap-2">
          <label htmlFor={id} className="text-sm font-medium capitalize leading-[19px] text-[#181818]">
            {label}
          </label>
          <input
            id={id}
            type="email"
            placeholder="designer@dignitestudios.com"
            className={inputClassName}
            {...register(id)}
          />
        </div>

        <div
          className={`-mt-3 rounded-b-[12px] rounded-t-[24px] border border-t-0 border-[#3D3775] px-4 pb-3 pt-6 transition-colors ${
            isPrimary ? "bg-[#ECEAFF]" : "bg-[#F7F6FF]"
          }`}
        >
          <input
            id={primaryInputId}
            type="radio"
            className="peer sr-only"
            {...register("primaryEmail")}
            value={primaryValue}
          />
          <label
            htmlFor={primaryInputId}
            className="relative z-20 flex cursor-pointer items-center gap-3"
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                isPrimary ? "border-[#083F92] bg-[#083F92]" : "border-black/50 bg-white"
              }`}
            >
              {isPrimary && <span className="h-2 w-2 rounded-full bg-white" />}
            </span>
            <span className="text-xs leading-4 tracking-[-0.02em] text-[#181818]">
              Make This Email Primary
            </span>
          </label>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function BecomeMemberForm() {
  const {
    form,
    onSubmit,
    isPending,
    showPassword,
    showConfirmPassword,
    togglePassword,
    toggleConfirmPassword,
  } = useBecomeMember();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const primaryEmail = useWatch({ control, name: "primaryEmail", defaultValue: "father" });

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-6 flex w-full max-w-[480px] flex-col items-center gap-3 text-center">
        <h1 className="text-[32px] font-semibold leading-[43px] text-[#083F92]">
          Become A WSCF Member
        </h1>
        <p className="text-base font-medium leading-[22px] tracking-[0.01em] text-[#565656]">
          Please complete details to Become A Member
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-[640px] flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-[22px]">
            <FormField
              id="name"
              label="Full Name"
              placeholder="John Doe"
              error={errors.name?.message}
              register={register}
            />
            <FormField
              id="grade"
              label="Grade"
              placeholder="5"
              error={errors.grade?.message}
              register={register}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-[22px]">
            <FormField
              id="birthDate"
              label="Birth Date"
              type="date"
              error={errors.birthDate?.message}
              register={register}
            />
            <FormField
              id="city"
              label="City"
              placeholder="Milwaukee"
              error={errors.city?.message}
              register={register}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-[22px]">
            <FormField
              id="streetAddress"
              label="Street Address"
              placeholder="NA 235 milwake"
              error={errors.streetAddress?.message}
              register={register}
            />
            <div className="flex w-full flex-col gap-2 sm:w-[309px]">
              <label
                htmlFor="zipCode"
                className="text-sm font-medium capitalize leading-[19px] text-[#181818]"
              >
                Zip Code
              </label>
              <div className="relative">
                <input
                  id="zipCode"
                  placeholder="54231"
                  className={`${inputClassName} pr-10`}
                  {...register("zipCode")}
                />
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-[-90deg]"
                  width="9"
                  height="16"
                  viewBox="0 0 9 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 1L8 8L1 15"
                    stroke="#000000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {errors.zipCode && <p className="text-xs text-red-600">{errors.zipCode.message}</p>}
            </div>
          </div>
        </div>

        <div className="h-px w-full border-t border-[#DDDDDD]" />

        <h2 className="text-lg font-semibold capitalize leading-6 text-[#181818]">Parent Details</h2>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-[22px]">
            <FormField
              id="fatherName"
              label="Father's/Guardian Full Name"
              placeholder="John Doe"
              error={errors.fatherName?.message}
              register={register}
            />
            <FormField
              id="motherName"
              label="Mother's/Guardian Full Name"
              placeholder="Jane Doe"
              error={errors.motherName?.message}
              register={register}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-[22px]">
            <FormField
              id="fatherPhone"
              label="Father's/Guardian Phone"
              type="tel"
              placeholder="1234567890"
              error={errors.fatherPhone?.message}
              register={register}
            />
            <FormField
              id="motherPhone"
              label="Mother's/Guardian Phone"
              type="tel"
              placeholder="0987654321"
              error={errors.motherPhone?.message}
              register={register}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-[22px]">
            <ParentEmailField
              id="fatherEmail"
              label="Email Address"
              primaryValue="father"
              isPrimary={primaryEmail === "father"}
              error={errors.fatherEmail?.message}
              register={register}
            />
            <ParentEmailField
              id="motherEmail"
              label="Email Address"
              primaryValue="mother"
              isPrimary={primaryEmail === "mother"}
              error={errors.motherEmail?.message}
              register={register}
            />
          </div>
        </div>

        <div className="h-px w-full border-t border-[#D8D4FF]" />

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-[22px]">
          <PasswordField
            id="password"
            label="Password"
            show={showPassword}
            onToggle={togglePassword}
            error={errors.password?.message}
            register={register}
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm Password"
            show={showConfirmPassword}
            onToggle={toggleConfirmPassword}
            error={errors.confirmPassword?.message}
            register={register}
          />
        </div>

        <div className="flex flex-col gap-6 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-60"
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </button>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-black/30 accent-[#083F92]"
              {...register("agreeToTerms")}
            />
            <span className="text-sm leading-[19px] text-[#3D3775]">
              I agree to the Terms and Conditions of the Wisconsin Scholastic Chess Federation
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="text-xs text-red-600">{errors.agreeToTerms.message}</p>
          )}
        </div>
      </form>
    </div>
  );
}
