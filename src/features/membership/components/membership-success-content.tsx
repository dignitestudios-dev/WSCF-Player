"use client";

import { useRouter } from "next/navigation";
import { MEMBER_LOGIN_ROUTE } from "@/config/routes";

export default function MembershipSuccessContent() {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-center gap-[26px]">
      <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#083F92]">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true">
          <path
            d="M14 26L22 34L36 16"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex w-full flex-col items-center gap-4 text-center">
        <h1 className="text-[32px] font-semibold capitalize leading-[39px] text-[#083F92]">
          Congratulations
        </h1>
        <p className="text-base leading-[22px] text-[#565656]">
          Your membership payment was successful!
        </p>
      </div>

      <button
        type="button"
        onClick={() => router.push(MEMBER_LOGIN_ROUTE)}
        className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875]"
      >
        Continue To Login
      </button>
    </div>
  );
}
