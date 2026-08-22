"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, TicketPercent, X } from "lucide-react";
import {
  validateCoupon,
  type AppliedCoupon,
} from "@/features/tournaments/api/coupons.service";

/**
 * The coupon box on the registration form.
 *
 * Applying is deliberately a separate step from submitting: the player sees
 * the fee change to $0.00 and can see it worked before they commit. A code
 * that does not work says why, in the words the server used, right under the
 * input — never as a toast that disappears.
 */
export default function CouponField({
  tournamentId,
  entryFee,
  applied,
  onApplied,
  onCleared,
  disabled = false,
}: {
  tournamentId: string;
  entryFee: number;
  applied: AppliedCoupon | null;
  onApplied: (coupon: AppliedCoupon) => void;
  onCleared: () => void;
  disabled?: boolean;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate: apply, isPending } = useMutation({
    mutationFn: () => validateCoupon({ code: code.trim(), tournamentId }),
    onSuccess: (coupon) => {
      setError(null);
      onApplied(coupon);
    },
    onError: (err: Error) => {
      // The API's message is written for the player — "That coupon code has
      // expired" reads better than anything generic we could substitute.
      setError(err.message || "That coupon code is not valid");
    },
  });

  const submit = () => {
    if (!code.trim() || isPending) return;
    apply();
  };

  const clear = () => {
    setCode("");
    setError(null);
    onCleared();
  };

  if (applied) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 rounded-[20px] border border-[#0F8B4C] bg-[#EDF9F2] px-4 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F8B4C]">
            <Check className="h-4 w-4 text-white" />
          </span>

          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-[#0F5132]">
              Coupon {applied.code} applied
            </span>
            <span className="text-xs text-[#0F5132]/80">
              {applied.coversFullFee
                ? "This tournament is now free"
                : `You save $${applied.amountDiscounted.toFixed(2)}`}
            </span>
          </div>

          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            aria-label="Remove coupon"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#0F5132] transition-colors hover:bg-[#0F8B4C]/10 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* The arithmetic in full, so the new total is never a surprise. */}
        <div className="flex items-center justify-between px-1 text-sm">
          <span className="text-[#565656] line-through">
            ${entryFee.toFixed(2)}
          </span>
          <span className="text-base font-semibold text-[#0F8B4C]">
            ${applied.payableAmount.toFixed(2)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="couponCode"
        className="flex items-center gap-1.5 text-sm font-medium leading-[19px] text-[#181818]"
      >
        <TicketPercent className="h-4 w-4 text-[#083F92]" />
        Have a coupon code?
      </label>

      <div className="flex gap-2">
        <input
          id="couponCode"
          value={code}
          autoComplete="off"
          spellCheck={false}
          placeholder="Enter code"
          disabled={disabled || isPending}
          onChange={(event) => {
            setCode(event.target.value);
            if (error) setError(null);
          }}
          // Enter applies the coupon rather than submitting the registration,
          // which is what pressing it here obviously means.
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submit();
            }
          }}
          className="h-11 w-full rounded-[24px] border border-[#3D3775] bg-white px-4 font-mono text-sm tracking-wide text-[#181818] outline-none placeholder:font-sans placeholder:tracking-normal placeholder:text-[#181818]/50 focus:ring-2 focus:ring-[#083F92]/15 disabled:opacity-60"
        />

        <button
          type="button"
          onClick={submit}
          disabled={disabled || isPending || !code.trim()}
          className="h-11 shrink-0 rounded-[24px] bg-[#083F92] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#063875] disabled:opacity-50"
        >
          {isPending ? "Checking..." : "Apply"}
        </button>
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      <p className="text-xs leading-4 text-[#8C8C8C]">
        Codes are case sensitive. Each code can be used once per player.
      </p>
    </div>
  );
}
