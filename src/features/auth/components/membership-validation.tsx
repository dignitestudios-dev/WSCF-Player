"use client";

import { useMembershipCheckout } from "@/features/membership/hooks/use-membership-checkout";
import { useMembershipQuoteQuery } from "@/features/membership/api/membership.mutations";

function CalendarIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
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
      <span className="text-xs font-medium leading-4 text-[#181818]">
        {label}
      </span>
      <span className="text-right text-xs font-normal leading-4 text-[#181818]">
        {value}
      </span>
    </div>
  );
}

/**
 * The bill, before Stripe.
 *
 * A membership is per player, so an account with five children owes five of
 * them. Every player is listed by name and the arithmetic is shown in full —
 * the total should never be a surprise at the checkout page.
 *
 * The figures come from the API rather than being computed here, so what is
 * displayed is exactly what is charged.
 */
export default function MembershipValidation() {
  const { handleProceedToPayment, isPending } = useMembershipCheckout();
  const { data: quote, isLoading } = useMembershipQuoteQuery();

  const players = quote?.players ?? [];
  const unitPrice = quote?.unitPrice ?? 5;

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

        {isLoading ? (
          <div className="mb-6 flex flex-col gap-3">
            {[0, 1, 2].map((key) => (
              <div
                key={key}
                className="h-4 w-full animate-pulse rounded-full bg-[#F2F2F2]"
              />
            ))}
          </div>
        ) : (
          <div className="mb-6 flex flex-col gap-[19px]">
            <SummaryRow label="Annual Membership" boldLabel />
            <SummaryRow label="Valid Until" value="August 31, 2026" />

            <div className="h-px w-full bg-[#F0F0F0]" />

            {/* One line per player, so it is obvious what the total covers. */}
            {players.map((player) => (
              <SummaryRow
                key={player._id}
                label={player.name}
                value={`$${unitPrice.toFixed(2)}`}
              />
            ))}

            <div className="h-px w-full bg-[#F0F0F0]" />

            <SummaryRow
              label={`${players.length} ${players.length === 1 ? "player" : "players"} × $${unitPrice.toFixed(2)}`}
              value={`$${(quote?.totalAmount ?? 0).toFixed(2)}`}
            />

            <div className="flex w-full items-center justify-between gap-4">
              <span className="text-sm font-semibold leading-5 text-[#181818]">
                Total
              </span>
              <span className="text-lg font-semibold leading-6 text-[#083F92]">
                ${(quote?.totalAmount ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleProceedToPayment}
          disabled={isPending || isLoading || players.length === 0}
          className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-60"
        >
          {isPending ? "Redirecting..." : "Proceed To Payment"}
        </button>
      </div>

      <p className="text-sm font-semibold leading-[19px] text-black">
        Note: All memberships expire on August 31 each year and cover one player
        each.
      </p>
    </div>
  );
}
