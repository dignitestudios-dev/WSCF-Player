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
      className="flex items-center gap-3 text-lg font-medium text-[#083F92] transition-opacity hover:opacity-80"
      aria-label="Go back"
    >
      <svg width="15" height="27" viewBox="0 0 15 27" fill="none" aria-hidden="true">
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
