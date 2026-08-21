"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MEMBERSHIP_VALIDATION_ROUTE } from "@/config/routes";
import { useAuth } from "@/hooks/use-auth";
import { useMembershipQuoteQuery } from "@/features/membership/api/membership.mutations";
import { useDiscardUnpaidChildrenMutation } from "@/features/players/api/children.queries";

/**
 * The checkout was abandoned.
 *
 * Two things happen here. Players added on the way to this payment were never
 * really added, so they are discarded first — otherwise they would sit on the
 * account unable to enter anything and turn up on the next bill. Only then is
 * the outstanding amount worth showing, which is why the quote is not read
 * until the discard has settled.
 *
 * Nothing was charged, so the only two useful things to offer are paying again
 * and signing out.
 */
export default function MembershipCancelContent() {
  const { logout } = useAuth();
  const { mutateAsync: discardUnpaid } = useDiscardUnpaidChildrenMutation();

  const [isDiscarding, setIsDiscarding] = useState(true);
  // Landing here twice (a reload, say) must not run the discard twice.
  const hasDiscarded = useRef(false);

  useEffect(() => {
    if (hasDiscarded.current) return;
    hasDiscarded.current = true;

    discardUnpaid()
      .catch(() => {
        // Nothing to undo if it fails: the next sign-in sweeps them up too.
      })
      .finally(() => setIsDiscarding(false));
  }, [discardUnpaid]);

  const { data: quote, isLoading } = useMembershipQuoteQuery({
    enabled: !isDiscarding,
  });

  const isBusy = isDiscarding || isLoading;
  const playerCount = quote?.playerCount ?? 0;

  return (
    <div className="flex w-full flex-col items-center gap-[26px] text-center">
      <h1 className="text-[32px] font-semibold leading-[39px] text-[#083F92]">
        Payment Cancelled
      </h1>

      {isBusy ? (
        <div className="flex w-full flex-col items-center gap-4">
          <div className="h-4 w-4/5 animate-pulse rounded-full bg-[#F2F2F2]" />
          <div className="h-4 w-3/5 animate-pulse rounded-full bg-[#F2F2F2]" />
          <div className="h-[52px] w-full animate-pulse rounded-[12px] bg-[#F2F2F2]" />
        </div>
      ) : (
        <>
          <p className="text-base leading-[22px] text-[#565656]">
            Your payment was not completed, so{" "}
            {playerCount > 1
              ? `none of your ${playerCount} players are members yet`
              : playerCount === 1
                ? "your player is not a member yet"
                : "nothing was charged"}
            . You can pay again whenever you are ready.
          </p>

          {quote && quote.totalAmount > 0 && (
            <div className="flex w-full items-center justify-between rounded-[12px] border border-[#DADADA] bg-white px-4 py-3">
              <span className="text-sm leading-5 text-[#565656]">
                {playerCount} {playerCount === 1 ? "player" : "players"} × $
                {quote.unitPrice.toFixed(2)}
              </span>
              <span className="text-base font-semibold text-[#083F92]">
                ${quote.totalAmount.toFixed(2)}
              </span>
            </div>
          )}
        </>
      )}

      <div className="flex w-full flex-col gap-3">
        <Link
          href={MEMBERSHIP_VALIDATION_ROUTE}
          className="flex h-12 w-full items-center justify-center rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875]"
        >
          Pay Again
        </Link>

        <button
          type="button"
          onClick={logout}
          className="h-12 w-full rounded-[24px] border border-[#3D3775] bg-white text-sm font-semibold capitalize text-[#3D3775] transition-colors hover:bg-[#F7F6FF]"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
