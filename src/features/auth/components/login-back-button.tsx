"use client";

import Link from "next/link";
import { AUTH_REDIRECT } from "@/config/routes";

interface LoginBackButtonProps {
  href?: string;
}

export default function LoginBackButton({
  href = AUTH_REDIRECT,
}: LoginBackButtonProps) {
  return (
    <Link
      href={href}
      // 44px high so a thumb can hit it; the desktop look is unchanged.
      className="inline-flex min-h-11 items-center gap-2 pr-3 text-base font-medium text-[#083F92] transition-opacity hover:opacity-80 md:gap-3 md:pr-0 md:text-lg"
      aria-label="Go back"
    >
      <svg width="15" height="27" viewBox="0 0 15 27" fill="none" aria-hidden="true" className="h-5 w-3 md:h-[27px] md:w-[15px]">
        <path
          d="M13 2L2 13.5L13 25"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back
    </Link>
  );
}
