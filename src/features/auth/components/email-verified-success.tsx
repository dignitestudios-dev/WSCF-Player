"use client";

import { useRouter } from "next/navigation";
import { MEMBERSHIP_VALIDATION_ROUTE } from "@/config/routes";

function SuccessCheckIcon() {
  return (
    <div className="flex h-[146px] w-[146px] items-center justify-center rounded-full bg-[#083F92]">
      <svg width="32" height="24" viewBox="0 0 32 24" fill="none" aria-hidden="true">
        <path
          d="M2 12L11 21L30 2"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function EmailVerifiedSuccess() {
  const router = useRouter();

  function handleContinue() {
    router.push(MEMBERSHIP_VALIDATION_ROUTE);
  }

  return (
    <div className="flex w-full flex-col items-center gap-[26px]">
      <SuccessCheckIcon />

      <div className="flex w-full flex-col gap-[33px]">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-[32px] font-semibold capitalize leading-[43px] text-[#083F92]">
            You&apos;re All Set!
          </h1>
          <p className="text-lg leading-6 text-black">
            Your email has been verified successfully, and your User ID has been sent to your email
            address.
          </p>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
