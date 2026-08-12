"use client";

import { useRouter } from "next/navigation";
import { useMembershipCheckout } from "@/features/membership/hooks/use-membership-checkout";
import { MEMBER_LOGIN_ROUTE } from "@/config/routes";

function CalendarIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect x="4" y="6" width="28" height="26" rx="4" fill="white" />
      <rect x="4" y="6" width="28" height="8" rx="4" fill="#DADADA" />
      <rect x="10" y="18" width="4" height="4" rx="1" fill="#083F92" />
      <rect x="16" y="18" width="4" height="4" rx="1" fill="#083F92" />
      <rect x="22" y="18" width="4" height="4" rx="1" fill="#083F92" />
      <rect x="10" y="24" width="4" height="4" rx="1" fill="#083F92" />
      <rect x="16" y="24" width="4" height="4" rx="1" fill="#083F92" />
    </svg>
  );
}

function SummaryRow({
  label,
  value,
  boldLabel = false,
}: {
  label: string;
  value?: string;
  boldLabel?: boolean;
}) {
  if (!value) {
    return (
      <div className="w-full">
        <span
          className={`text-xs leading-4 ${boldLabel ? "font-semibold" : "font-medium"} text-[#181818]`}
        >
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <span className="text-xs font-medium leading-4 text-[#181818]">{label}</span>
      <span className="text-right text-xs font-normal leading-4 text-[#181818]">{value}</span>
    </div>
  );
}

export default function MembershipValidation() {
  const { handleProceedToPayment, isPending } = useMembershipCheckout();

  return (
    <div className="flex w-full max-w-[398px] flex-col gap-[15px]">
      <h1 className="text-center text-[32px] font-semibold leading-[43px] text-[#083F92]">
        Membership Validation
      </h1>

      <div className="relative flex items-center rounded-[12px] bg-[#083F92] px-[60px] py-3 pl-14">
        <div className="absolute left-[14px] top-[13px]">
          <CalendarIcon />
        </div>
        <p className="text-sm leading-[19px] text-white">
          Your membership will be valid until <br />
          <b>August 31, 2026</b>
        </p>
      </div>

      <div className="rounded-[12px] border border-[#DADADA] bg-white p-3">
        <h2 className="mb-6 text-[22px] font-medium leading-[30px] text-[#181818]">
          Membership Summary
        </h2>

        <div className="mb-6 flex flex-col gap-[19px]">
          <SummaryRow label="Annual Membership" boldLabel />
          <SummaryRow label="Valid From" value="July 31, 2025" />
          <SummaryRow label="Valid Until" value="August 31, 2026" />
          <SummaryRow label="Amount" value="$5.00" />
        </div>

        <button
          type="button"
          onClick={handleProceedToPayment}
          disabled={isPending}
          className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-60"
        >
          {isPending ? "Redirecting..." : "Proceed To Payment"}
        </button>
      </div>

      <p className="text-sm font-semibold leading-[19px] text-black">
        Note: All memberships expire on August 31 each year. Your current plan is valid for 1 month
        and must be renewed after expiration.
      </p>
    </div>
  );
}
