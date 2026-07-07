"use client";

import Link from "next/link";
import { MEMBERSHIP_VALIDATION_ROUTE } from "@/config/routes";

export default function MembershipCancelContent() {
  return (
    <div className="flex w-full flex-col items-center gap-[26px] text-center">
      <h1 className="text-[32px] font-semibold leading-[39px] text-[#083F92]">
        Payment Cancelled
      </h1>
      <p className="text-base leading-[22px] text-[#565656]">
        Your membership payment was not completed. You can try again when you are ready.
      </p>

      <Link
        href={MEMBERSHIP_VALIDATION_ROUTE}
        className="flex h-12 w-full items-center justify-center rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875]"
      >
        Back To Membership
      </Link>
    </div>
  );
}
