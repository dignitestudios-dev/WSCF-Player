"use client";

import { useForgotPassword } from "@/features/auth/hooks/use-forgot-password";
import { ForgotPasswordIcon } from "@/features/auth/components/forgot-password-icons";

export default function ForgotPasswordForm() {
  const { form, onSubmit, isPending, error } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="flex w-full flex-col items-center gap-[26px]">
      <div className="flex h-[146px] w-[146px] items-center justify-center rounded-full bg-[rgba(8,63,146,0.1)]">
        <ForgotPasswordIcon />
      </div>

      <div className="flex w-full flex-col gap-[33px]">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-[32px] font-semibold capitalize leading-[43px] tracking-[-0.008em] text-[#083F92]">
            Forgot Password
          </h1>
          <p className="text-base leading-[22px] tracking-[-0.014em] text-[#565656]">
            Please enter your details to log in.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[26px]">
        {/* Locked while the request is in flight: disabling only the
            submit button leaves every field editable after the values
            have already been sent. `contents` keeps the fieldset out
            of the layout. */}
        <fieldset disabled={isPending} className="contents">
          {error && (
            <p className="text-center text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium capitalize leading-[19px] text-[#181818]"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="designer@dignitestudios.com"
              className="h-11 w-full rounded-[24px] border border-[#3D3775] bg-white px-4 text-sm text-[#181818] outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-[#083F92]/15"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-60"
          >
            {isPending ? "Sending..." : "Submit"}
          </button>
        </fieldset>
        </form>
      </div>
    </div>
  );
}
