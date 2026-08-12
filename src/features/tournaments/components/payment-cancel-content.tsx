"use client";

import { useRouter } from "next/navigation";
import { DASHBOARD_TOURNAMENTS_ROUTE } from "@/config/routes";

export default function PaymentCancelContent() {
  const router = useRouter();

  const handleContinue = () => {
    router.push(DASHBOARD_TOURNAMENTS_ROUTE);
  };

  return (
    <div className="flex w-full flex-col items-center gap-[26px]">
      <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-red-100">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex w-full flex-col items-center gap-4 text-center">
        <h1 className="text-[32px] font-semibold capitalize leading-[39px] text-[#083F92]">
          Payment Cancelled
        </h1>
        <p className="text-base leading-[22px] text-[#565656]">
          Your tournament payment was cancelled or failed. You are not registered.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={handleContinue}
          className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] cursor-pointer"
        >
          Return to Tournaments
        </button>
      </div>
    </div>
  );
}
