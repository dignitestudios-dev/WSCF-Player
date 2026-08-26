"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { UseFormRegister, Control } from "react-hook-form";
import CouponField from "@/features/tournaments/components/coupon-field";
import type { AppliedCoupon } from "@/features/tournaments/api/coupons.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

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
  placeholder,
  error,
  register,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register: UseFormRegister<any>;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium capitalize leading-[19px] text-[#181818]">
        {label}
      </label>
      <input id={id} type={type} placeholder={placeholder} className={inputClassName} {...register(id)} />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function SelectField({
  id,
  label,
  options,
  placeholder,
  error,
  control,
  className,
}: {
  id: string;
  label: string;
  options: string[] | { label: string; value: string }[];
  placeholder?: string;
  error?: string;
  control: Control<any>;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col gap-2 ${className ?? ""}`}>
      <label htmlFor={id} className="text-sm font-medium capitalize leading-[19px] text-[#181818]">
        {label}
      </label>
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger id={id} className={`${inputClassName} font-normal focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0`}>
              <SelectValue placeholder={placeholder || "Select drop down"} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => {
                const val = typeof option === "string" ? option : option.value;
                const lbl = typeof option === "string" ? option : option.label;
                return (
                  <SelectItem key={val} value={val}>
                    {lbl}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

interface TournamentRegistrationModalProps {
  tournament: TournamentRegistrationTarget;
  onClose: () => void;
  onSubmit: (data: any) => void;
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: Partial<Record<string, { message?: string }>>;
  handleSubmit: (callback: (data: any) => void) => (event?: React.BaseSyntheticEvent) => void;
  fields: FormFieldApiData[];
  divisions?: any[];
  isFieldsPending: boolean;
  isRegistering?: boolean;
  /** Only offered when there is a fee to discount. */
  entryFee?: number;
  appliedCoupon?: AppliedCoupon | null;
  onCouponApplied?: (coupon: AppliedCoupon) => void;
  onCouponCleared?: () => void;
}

export default function TournamentRegistrationModal({
  tournament,
  onClose,
  onSubmit,
  register,
  control,
  errors,
  handleSubmit,
  fields,
  divisions = [],
  isFieldsPending,
  isRegistering,
  entryFee = 0,
  appliedCoupon = null,
  onCouponApplied,
  onCouponCleared,
}: TournamentRegistrationModalProps) {
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  // A free tournament has nothing to discount, so the box is not shown at all
  // rather than shown and then refused.
  const canUseCoupon = entryFee > 0 && Boolean(onCouponApplied);
  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] w-full max-w-[626px]! flex-col gap-[42px] overflow-y-auto rounded-[12px] bg-white px-6 py-[42px] sm:px-[52px] border-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] !outline-none"
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

        {isFieldsPending ? (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[22px] gap-y-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex min-w-0 flex-1 flex-col gap-2">
                  <Skeleton className="h-[19px] w-24" />
                  <Skeleton className="h-11 w-full rounded-[24px]" />
                </div>
              ))}
            </div>
            <Skeleton className="h-12 w-full rounded-[24px]" />
          </div>
        ) : divisions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-[20px] font-semibold text-[#181818] tracking-tight">Not Eligible</h3>
            <p className="text-[14px] text-[#181818]/70 max-w-[280px]">
              You are not eligible for any divisions in this tournament based on your profile.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[22px] gap-y-8">
              {fields.map((field) => {
                const errorMsg = errors[field._id]?.message;

                if (field.fieldType === "dropdown") {
                  return (
                    <SelectField
                      key={field._id}
                      id={field._id}
                      label={field.fieldName}
                      placeholder={`Select ${field.fieldName}`}
                      options={field.options}
                      error={errorMsg}
                      control={control}
                    />
                  );
                }

                return (
                  <FormField
                    key={field._id}
                    id={field._id}
                    label={field.fieldName}
                    placeholder={`Enter ${field.fieldName}`}
                    type={field.fieldType === "number" ? "number" : "text"}
                    error={errorMsg}
                    register={register}
                  />
                );
              })}
              {divisions.length > 0 && (
                <SelectField
                  id="divisionId"
                  label="Division"
                  placeholder="Select division"
                  options={divisions.map((d) => ({
                    label: d.label || d.divisionName || d.type,
                    value: d._id,
                  }))}
                  error={errors.divisionId?.message}
                  control={control}
                  className={fields.length === 0 ? "sm:col-span-2" : undefined}
                />
              )}
            </div>

            {canUseCoupon && (
              <div className="border-t border-[#EFEFEF] pt-5">
                <CouponField
                  tournamentId={tournament.id}
                  entryFee={entryFee}
                  applied={appliedCoupon}
                  onApplied={onCouponApplied!}
                  onCleared={onCouponCleared!}
                  disabled={isRegistering}
                  onCheckingChange={setIsCheckingCoupon}
                />
              </div>
            )}

            <button
              type="submit"
              // A coupon still being checked may yet change the fee, so the
              // registration cannot be submitted against a total that is about
              // to move.
              disabled={isRegistering || isCheckingCoupon}
              className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegistering
                ? "Submitting..."
                : appliedCoupon?.coversFullFee
                  ? "Register for Free"
                  : "Submit"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
