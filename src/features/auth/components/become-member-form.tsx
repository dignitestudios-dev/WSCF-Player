"use client";

import { useState } from "react";
import type { UseFormRegister } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { UserPlus } from "lucide-react";
import { EyeIcon } from "@/features/auth/components/set-new-password-icons";
import ChildProfileCard from "@/features/auth/components/child-profile-card";
import ChildProfileDialog from "@/features/auth/components/child-profile-dialog";
import { useBecomeMember } from "@/features/auth/hooks/use-become-member";
import type { BecomeMemberFormData } from "@/features/auth/schemas/become-member.schema";
import type { ChildFormData } from "@/features/auth/schemas/child.schema";

/** What one membership costs, per player. */
const MEMBERSHIP_UNIT_PRICE = 5;

/** Red asterisk on the labels of fields the schema rejects when empty. */
function RequiredMark() {
  return <span className="text-red-500">{" *"}</span>;
}

const inputClassName =
  "h-11 w-full rounded-[24px] border border-[#3D3775] bg-white px-4 text-sm text-[#181818] outline-none placeholder:text-[#181818]/60 focus:ring-2 focus:ring-[#083F92]/15";

function FormField({
  id,
  label,
  type = "text",
  placeholder,
  error,
  required,
  register,
  numericOnly,
  maxLength,
}: {
  id: keyof Pick<
    BecomeMemberFormData,
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
  required?: boolean;
  register: UseFormRegister<BecomeMemberFormData>;
  numericOnly?: boolean;
  maxLength?: number;
}) {
  return (
    <div className="flex w-full flex-col gap-2 sm:w-[309px]">
      <label htmlFor={id} className="text-sm font-medium capitalize leading-[19px] text-[#181818]">
        {label}
        {required && <RequiredMark />}
      </label>
      <input
        id={id}
        type={type}
        inputMode={numericOnly ? "numeric" : undefined}
        maxLength={maxLength}
        placeholder={placeholder}
        className={inputClassName}
        {...register(id, {
          onChange:
            type === "tel"
              ? (e) => {
                  const value = e.target.value;
                  const phoneNumber = value.replace(/[^\d]/g, "");
                  if (phoneNumber.length < 4) {
                    e.target.value = phoneNumber;
                  } else if (phoneNumber.length < 7) {
                    e.target.value = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
                  } else {
                    e.target.value = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
                  }
                }
              : numericOnly
              ? (e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }
              : undefined,
        })}
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
  required,
  register,
  maxLength,
}: {
  id: "password" | "confirmPassword";
  label: string;
  show: boolean;
  onToggle: () => void;
  error?: string;
  required?: boolean;
  register: UseFormRegister<BecomeMemberFormData>;
  maxLength?: number;
}) {
  return (
    <div className={`flex w-full flex-col gap-2 sm:w-[309px]`}>
      <label htmlFor={id} className="text-sm font-medium capitalize leading-[19px] text-[#181818]">
        {label}
        {required && <RequiredMark />}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          maxLength={maxLength}
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
  required,
  register,
  maxLength,
}: {
  id: "fatherEmail" | "motherEmail";
  label: string;
  primaryValue: "father" | "mother";
  isPrimary: boolean;
  error?: string;
  required?: boolean;
  register: UseFormRegister<BecomeMemberFormData>;
  maxLength?: number;
}) {
  const primaryInputId = `primary-email-${primaryValue}`;

  return (
    <div className="w-full sm:w-[309px]">
      <div className="relative">
        <div className="flex flex-col gap-2">
          <label htmlFor={id} className="text-sm font-medium capitalize leading-[19px] text-[#181818]">
            {label}
            {required && <RequiredMark />}
          </label>
          <input
            id={id}
            type="email"
            maxLength={maxLength}
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
    setValue,
    formState: { errors },
  } = form;

  const primaryEmail = useWatch({
    control,
    name: "primaryEmail",
    defaultValue: "father",
  });

  // The players being added. Held in form state so the schema can require at
  // least one, and edited through the dialog rather than inline.
  const children = useWatch({ control, name: "children", defaultValue: [] });

  const [isChildDialogOpen, setIsChildDialogOpen] = useState(false);
  // Which card the dialog is editing; null means it is adding a new one.
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const openAddChild = () => {
    setEditingIndex(null);
    setIsChildDialogOpen(true);
  };

  const openEditChild = (index: number) => {
    setEditingIndex(index);
    setIsChildDialogOpen(true);
  };

  const saveChild = (child: ChildFormData) => {
    const next = [...children];
    if (editingIndex === null) {
      next.push(child);
    } else {
      next[editingIndex] = child;
    }
    setValue("children", next, { shouldValidate: true, shouldDirty: true });
  };

  const removeChild = (index: number) => {
    setValue(
      "children",
      children.filter((_, i) => i !== index),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const total = children.length * MEMBERSHIP_UNIT_PRICE;

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-6 flex w-full max-w-[480px] flex-col items-center gap-3 text-center">
        <h1 className="text-[32px] font-semibold leading-[43px] text-[#083F92]">
          Become A WSCF Member
        </h1>
        <p className="text-base font-medium leading-[22px] tracking-[0.01em] text-[#565656]">
          Create your parent account, then add each child who will play
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-[640px] flex-col gap-4"
      >
        {/* Locked while the request is in flight: disabling only the
            submit button leaves every field editable after the values
            have already been sent. `contents` keeps the fieldset out
            of the layout. */}
        <fieldset disabled={isPending} className="contents">
        <h2 className="text-lg font-semibold capitalize leading-6 text-[#181818]">
          Parent / Guardian Details
        </h2>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-[22px]">
            <FormField
              id="fatherName"
              required={primaryEmail === "father"}
              label="Father's/Guardian Full Name"
              placeholder="John Doe"
              error={errors.fatherName?.message}
              register={register}
              maxLength={100}
            />
            <FormField
              id="motherName"
              required={primaryEmail === "mother"}
              label="Mother's/Guardian Full Name"
              placeholder="Jane Doe"
              error={errors.motherName?.message}
              register={register}
              maxLength={100}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-[22px]">
            <FormField
              id="fatherPhone"
              required={primaryEmail === "father"}
              label="Father's/Guardian Phone"
              type="tel"
              placeholder="(123) 456-7890"
              error={errors.fatherPhone?.message}
              register={register}
              maxLength={14}
            />
            <FormField
              id="motherPhone"
              required={primaryEmail === "mother"}
              label="Mother's/Guardian Phone"
              type="tel"
              placeholder="(098) 765-4321"
              error={errors.motherPhone?.message}
              register={register}
              maxLength={14}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-[22px]">
            <ParentEmailField
              id="fatherEmail"
              required={primaryEmail === "father"}
              label="Email Address"
              primaryValue="father"
              isPrimary={primaryEmail === "father"}
              error={errors.fatherEmail?.message}
              register={register}
              maxLength={150}
            />
            <ParentEmailField
              id="motherEmail"
              required={primaryEmail === "mother"}
              label="Email Address"
              primaryValue="mother"
              isPrimary={primaryEmail === "mother"}
              error={errors.motherEmail?.message}
              register={register}
              maxLength={150}
            />
          </div>

          <p className="text-xs leading-4 text-[#565656]">
            The primary guardian&apos;s name, phone and email are required — that
            email is the one you will sign in with. The other guardian is
            optional.
          </p>
        </div>

        <div className="h-px w-full border-t border-[#DDDDDD]" />

        <h2 className="text-lg font-semibold capitalize leading-6 text-[#181818]">
          Password
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-[22px]">
          <PasswordField
            id="password"
            required
            label="Password"
            show={showPassword}
            onToggle={togglePassword}
            error={errors.password?.message}
            register={register}
            maxLength={100}
          />
          <PasswordField
            id="confirmPassword"
            required
            label="Confirm Password"
            show={showConfirmPassword}
            onToggle={toggleConfirmPassword}
            error={errors.confirmPassword?.message}
            register={register}
            maxLength={100}
          />
        </div>

        <div className="h-px w-full border-t border-[#DDDDDD]" />

        <h2 className="text-lg font-semibold capitalize leading-6 text-[#181818]">
          Home Address
        </h2>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-[22px]">
            <FormField
              id="streetAddress"
              required
              label="Street Address"
              placeholder="NA 235 milwake"
              error={errors.streetAddress?.message}
              register={register}
              maxLength={50}
            />
            <FormField
              id="city"
              required
              label="City"
              placeholder="Milwaukee"
              error={errors.city?.message}
              register={register}
              maxLength={30}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-[22px]">
            <div className="flex w-full flex-col gap-2 sm:w-[309px]">
              <label
                htmlFor="zipCode"
                className="text-sm font-medium capitalize leading-[19px] text-[#181818]"
              >
                Zip Code
                <RequiredMark />
              </label>
              <input
                id="zipCode"
                inputMode="numeric"
                maxLength={5}
                placeholder="54231"
                className={inputClassName}
                {...register("zipCode", {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  },
                })}
              />
              {errors.zipCode && (
                <p className="text-xs text-red-600">{errors.zipCode.message}</p>
              )}
            </div>
          </div>

          <p className="text-xs leading-4 text-[#565656]">
            One address for the household — it applies to every player you add.
          </p>
        </div>

        <div className="h-px w-full border-t border-[#DDDDDD]" />

        {/* --- the players ------------------------------------------------ */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold capitalize leading-6 text-[#181818]">
              Player Profiles
            </h2>
            <p className="text-sm leading-5 text-[#565656]">
              Add each child who will play. At least one is required.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddChild}
            className="flex h-11 shrink-0 items-center gap-2 rounded-[24px] bg-[#083F92] px-5 text-sm font-semibold text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875]"
          >
            <UserPlus className="h-4 w-4" />
            Add Player
          </button>
        </div>

        {children.length === 0 ? (
          <button
            type="button"
            onClick={openAddChild}
            className="flex w-full flex-col items-center gap-2 rounded-[24px] border border-dashed border-[#3D3775]/40 bg-[#F7F6FF] px-4 py-8 text-center transition-colors hover:border-[#3D3775] hover:bg-[#ECEAFF]"
          >
            <UserPlus className="h-6 w-6 text-[#083F92]" />
            <span className="text-sm font-semibold text-[#083F92]">
              Add your first player
            </span>
            <span className="text-xs text-[#565656]">
              Each player costs ${MEMBERSHIP_UNIT_PRICE} per season
            </span>
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            {children.map((child, index) => (
              <ChildProfileCard
                key={`${child.firstName}-${child.lastName}-${index}`}
                child={child}
                onEdit={() => openEditChild(index)}
                onRemove={() => removeChild(index)}
              />
            ))}

            {/* The bill, shown before they commit rather than at Stripe. */}
            <div className="flex items-center justify-between rounded-[24px] border border-[#D8D4FF] bg-white px-4 py-3">
              <span className="text-sm leading-5 text-[#565656]">
                {children.length}{" "}
                {children.length === 1 ? "player" : "players"} × $
                {MEMBERSHIP_UNIT_PRICE.toFixed(2)}
              </span>
              <span className="text-base font-semibold text-[#083F92]">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {errors.children && (
          <p className="text-xs text-red-600">
            {errors.children.message as string}
          </p>
        )}

        <div className="flex flex-col gap-6 pt-2">
          <div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-black/30 accent-[#083F92]"
                {...register("agreeToTerms")}
              />
              <span className="text-sm leading-[19px] text-[#3D3775]">
                I agree to the Terms and Conditions of the Wisconsin Scholastic
                Chess Federation
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="mt-1 text-xs text-red-600">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-60"
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </fieldset>
        </form>

      {/* Mounted only while open, so each open starts from a clean form. */}
      {isChildDialogOpen && (
        <ChildProfileDialog
          onClose={() => setIsChildDialogOpen(false)}
          onSubmit={saveChild}
          initialValue={editingIndex === null ? null : children[editingIndex]}
        />
      )}
    </div>
  );
}
