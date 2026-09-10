"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  childSchema,
  type ChildFormData,
} from "@/features/auth/schemas/child.schema";
import {
  parseCalendarDate,
  toCalendarDateString,
} from "@/lib/calendar-date";

const inputClassName =
  "h-11 w-full rounded-[24px] border border-[#3D3775] bg-white px-4 text-sm text-[#181818] outline-none placeholder:text-[#181818]/60 focus:ring-2 focus:ring-[#083F92]/15";

function RequiredMark() {
  return <span className="text-red-500">{" *"}</span>;
}

/**
 * The window a player's birth date can fall in: at least 4 years old, at most
 * 21. Shared by the picker and the schema so they cannot disagree.
 */
const YEAR_RANGE = (() => {
  const latest = new Date();
  latest.setFullYear(latest.getFullYear() - 4);

  const earliest = new Date();
  earliest.setFullYear(earliest.getFullYear() - 21);

  return { earliest, latest };
})();

const EMPTY_CHILD: ChildFormData = {
  firstName: "",
  lastName: "",
  gender: "" as ChildFormData["gender"],
  birthDate: "",
  grade: "",
};

/**
 * Adds or edits one player on the account. `initialValue` set means editing.
 *
 * Mounted only while it is open — the caller renders it conditionally.
 *
 * That is what keeps the form honest. Holding it mounted and resetting on an
 * `open` prop meant the reset re-ran whenever `initialValue` arrived as a new
 * object, which it does on every render when it comes from a watched array —
 * wiping whatever had just been typed and reporting the fields as empty.
 * Mounting fresh gives each open its own state with nothing to re-sync.
 */
export default function ChildProfileDialog({
  onClose,
  onSubmit,
  initialValue,
  isSaving = false,
}: {
  onClose: () => void;
  onSubmit: (child: ChildFormData) => void;
  initialValue?: ChildFormData | null;
  isSaving?: boolean;
}) {
  const [isDateOpen, setIsDateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChildFormData>({
    resolver: zodResolver(childSchema),
    defaultValues: initialValue || EMPTY_CHILD,
  });

  const submit = (data: ChildFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default bg-black/40"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-[24px] bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-xl font-semibold leading-7 text-[#083F92]">
            {initialValue ? "Edit Player" : "Add Player Profile"}
          </h2>
          <p className="text-sm leading-5 text-[#565656]">
            Enter your child&apos;s details. Each player gets their own
            membership.
          </p>
        </div>

        {/* Nested inside the signup form, so this is a div, not a <form>:
            a form inside a form submits the outer one. */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="child-firstName"
                className="text-sm font-medium capitalize leading-[19px] text-[#181818]"
              >
                First Name
                <RequiredMark />
              </label>
              <input
                id="child-firstName"
                placeholder="John"
                maxLength={50}
                className={inputClassName}
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-xs text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="child-lastName"
                className="text-sm font-medium capitalize leading-[19px] text-[#181818]"
              >
                Last Name
                <RequiredMark />
              </label>
              <input
                id="child-lastName"
                placeholder="Doe"
                maxLength={50}
                className={inputClassName}
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-xs text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="child-gender"
                className="text-sm font-medium capitalize leading-[19px] text-[#181818]"
              >
                Gender
                <RequiredMark />
              </label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger id="child-gender" className={inputClassName}>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && (
                <p className="text-xs text-red-600">
                  {errors.gender.message as string}
                </p>
              )}
            </div>

            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="child-grade"
                className="text-sm font-medium capitalize leading-[19px] text-[#181818]"
              >
                Grade
                <RequiredMark />
              </label>
              <Controller
                control={control}
                name="grade"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger id="child-grade" className={inputClassName}>
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="K">K</SelectItem>
                      {Array.from({ length: 12 }, (_, i) => String(i + 1)).map(
                        (g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.grade && (
                <p className="text-xs text-red-600">
                  {errors.grade.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="child-birthDate"
              className="text-sm font-medium capitalize leading-[19px] text-[#181818]"
            >
              Birth Date
              <RequiredMark />
            </label>
            <Controller
              name="birthDate"
              control={control}
              render={({ field }) => (
                <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                  <PopoverTrigger
                    onClick={() => setIsDateOpen(true)}
                    className={cn(
                      inputClassName,
                      "flex items-center justify-between text-left",
                      !field.value && "text-[#181818]/60",
                    )}
                  >
                    {field.value
                      ? format(parseCalendarDate(field.value)!, "PPP")
                      : "Select birth date"}
                    <CalendarIcon className="h-4 w-4 opacity-60" />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    {/* Players are 4 to 21, so the year dropdown offers only
                        those years — the current year is never a valid birth
                        year for a player. */}
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      startMonth={YEAR_RANGE.earliest}
                      endMonth={YEAR_RANGE.latest}
                      defaultMonth={
                        parseCalendarDate(field.value) ?? YEAR_RANGE.latest
                      }
                      selected={parseCalendarDate(field.value) ?? undefined}
                      onSelect={(date) => {
                        field.onChange(toCalendarDateString(date));
                        setIsDateOpen(false);
                      }}
                      disabled={(date) =>
                        date > YEAR_RANGE.latest || date < YEAR_RANGE.earliest
                      }
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.birthDate && (
              <p className="text-xs text-red-600">{errors.birthDate.message}</p>
            )}
          </div>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="h-12 w-full rounded-[24px] border border-[#3D3775] bg-white text-sm font-semibold capitalize text-[#3D3775] transition-colors hover:bg-[#F7F6FF]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSubmit(submit)}
              className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-60"
            >
              {isSaving
                ? "Saving..."
                : initialValue
                  ? "Save Player"
                  : "Add Player"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
