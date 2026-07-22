"use client";

import { Controller } from "react-hook-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { UseFormRegister, Control } from "react-hook-form";
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
  error,
  register,
}: {
  id: string;
  label: string;
  type?: string;
  error?: string;
  register: UseFormRegister<any>;
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

function SelectField({
  id,
  label,
  options,
  error,
  control,
}: {
  id: string;
  label: string;
  options: string[];
  error?: string;
  control: Control<any>;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium capitalize leading-[19px] text-[#181818]">
        {label}
      </label>
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger id={id} className={`${inputClassName} font-normal focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0`}>
              <SelectValue placeholder="Select drop down" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

interface TournamentRegistrationModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: Partial<Record<string, { message?: string }>>;
  handleSubmit: (callback: (data: any) => void) => (event?: React.BaseSyntheticEvent) => void;
  fields: FormFieldApiData[];
  isFieldsPending: boolean;
  isRegistering?: boolean;
}

export default function TournamentRegistrationModal({
  onClose,
  onSubmit,
  register,
  control,
  errors,
  handleSubmit,
  fields,
  isFieldsPending,
  isRegistering,
}: TournamentRegistrationModalProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent 
        showCloseButton={false}
        className="relative flex max-h-[90vh] w-full max-w-[626px] flex-col gap-[42px] overflow-y-auto rounded-[12px] bg-white px-6 py-[42px] sm:px-[52px] border-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] !outline-none"
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
        ) : fields.length === 0 ? (
          <div className="flex justify-center p-8 text-[#181818]/60">
            No registration fields found.
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
                    type={field.fieldType === "number" ? "number" : "text"}
                    error={errorMsg}
                    register={register}
                  />
                );
              })}
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegistering ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
