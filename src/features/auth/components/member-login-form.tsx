"use client";

import Link from "next/link";
import { FORGOT_PASSWORD_ROUTE } from "@/config/routes";
import { useMemberLogin } from "@/features/auth/hooks/use-member-login";

function EyeIcon({ hidden }: { hidden: boolean }) {
  if (hidden) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
          stroke="#9CA3AF"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="12" r="3" stroke="#9CA3AF" strokeWidth="1.5" />
        <path d="M3 3L21 21" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
        stroke="#9CA3AF"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3" stroke="#9CA3AF" strokeWidth="1.5" />
    </svg>
  );
}

export default function MemberLoginForm() {
  const { form, onSubmit, isPending, showPassword, togglePassword } =
    useMemberLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-[32px] font-semibold leading-tight text-[#083F92]">
          Welcome To The App
        </h1>
        <p className="mt-2 text-base text-zinc-500">
          Please enter your details to log in.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Locked while the request is in flight: disabling only the
            submit button leaves every field editable after the values
            have already been sent. `contents` keeps the fieldset out
            of the layout. */}
        <fieldset disabled={isPending} className="contents">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="designer@dignitestudios.com"
            className="h-14 w-full rounded-full border border-zinc-200 bg-white px-5 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-[#083F92] focus:ring-2 focus:ring-[#083F92]/15"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-zinc-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-14 w-full rounded-full border border-zinc-200 bg-white px-5 pr-12 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-[#083F92] focus:ring-2 focus:ring-[#083F92]/15"
              {...register("password")}
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon hidden={!showPassword} />
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            href={FORGOT_PASSWORD_ROUTE}
            className="text-sm font-medium text-[#083F92] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="h-14 w-full rounded-full bg-[#083F92] text-base font-medium text-white shadow-[0px_4px_4px_rgba(6,62,145,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-60"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </fieldset>
        </form>
    </div>
  );
}
