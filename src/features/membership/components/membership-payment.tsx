"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { DEFAULT_REDIRECT } from "@/config/routes";
import { useActivePlayer } from "@/features/players/use-active-player";
import {
  CLAIM_RATINGS_ROUTE,
  SELECT_PLAYER_ROUTE,
} from "@/features/players/routes";
import { useMembershipCheckout } from "@/features/membership/hooks/use-membership-checkout";
import { useMembershipQuoteQuery } from "@/features/membership/api/membership.mutations";
import { validateMembershipCoupon } from "@/features/membership/api/membership.service";
import CouponField from "@/features/tournaments/components/coupon-field";
import type { AppliedCoupon } from "@/features/tournaments/api/coupons.service";
import { useAuth } from "@/hooks/use-auth";
import LogoutConfirmModal from "@/features/dashboard/components/logout-confirm-modal";

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
 * The membership payment page: the bill, before PayPal.
 *
 * It is where signup, adding a player and renewing all end up, so an
 * organization's coupon code is entered here, once. A code that covers the bill
 * skips PayPal entirely.
 *
 * A membership is per player, so an account with five children owes five of
 * them. Every player is listed by name and the arithmetic is shown in full —
 * the total should never be a surprise at the checkout page.
 *
 * The figures come from the API rather than being computed here, so what is
 * displayed is exactly what is charged.
 */
export default function MembershipPayment() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  const { handleProceedToPayment, isPending } = useMembershipCheckout();
  const { data: quote, isLoading } = useMembershipQuoteQuery();
  const { children, needsMasterFileCheck } = useActivePlayer();

  const players = quote?.players ?? [];
  const unitPrice = quote?.unitPrice ?? 5;
  // Worked out by the API in Wisconsin time, so this page and the date the
  // membership actually gets can never disagree around 31 August.
  const validUntil = quote?.validUntilLabel;
  const totalAmount = quote?.totalAmount ?? 0;
  const isFree = Boolean(appliedCoupon?.coversFullFee);

  // Nothing owed — every player on the account is already covered.
  const nothingToPay = !isLoading && players.length === 0;

  // Sent on once, never twice: a second navigation while the first is still in
  // flight is what turns a redirect into a loop.
  const hasRedirected = useRef(false);

  /**
   * Nothing to pay means nothing to do here, so the parent is moved along
   * rather than shown a $0 bill.
   *
   * The account payload is refreshed first, deliberately. AuthGuard routes on
   * `needsMembershipPayment` from /user/me, and it is what sent them here; if
   * that were still cached as true, navigating away would simply bounce them
   * straight back. Invalidating it means the guard re-reads the same truth the
   * quote is reporting.
   *
   * Where they go next matches the post-payment screen: ratings first, since
   * every player has to be answered for before any of them can be shown; then
   * the picker if there is a choice to make; otherwise the dashboard.
   */
  useEffect(() => {
    if (!nothingToPay || hasRedirected.current) return;
    hasRedirected.current = true;

    queryClient.invalidateQueries({ queryKey: ["authUser"] });

    const destination = needsMasterFileCheck
      ? CLAIM_RATINGS_ROUTE
      : children.length > 1
        ? SELECT_PLAYER_ROUTE
        : DEFAULT_REDIRECT;

    router.replace(destination);
  }, [nothingToPay, needsMasterFileCheck, children.length, router, queryClient]);

  if (nothingToPay) {
    // Everything is covered; the redirect above is already running. Showing a
    // $0 summary here, even for one frame, would just look like a bug.
    return (
      <div className="flex w-full max-w-[398px] flex-col items-center gap-[15px]">
        <div className="h-8 w-3/5 animate-pulse rounded-full bg-[#F2F2F2]" />
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-[#F2F2F2]" />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[398px] flex-col gap-[15px]">
      <h1 className="text-center text-[32px] font-semibold leading-[43px] text-[#083F92]">
        Membership Payment
      </h1>

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
            {validUntil ? (
              <SummaryRow label="Valid Until" value={validUntil} />
            ) : null}

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
              <span className="flex items-baseline gap-2">
                {isFree ? (
                  <span className="text-sm text-[#565656] line-through">
                    ${totalAmount.toFixed(2)}
                  </span>
                ) : null}
                <span className="text-lg font-semibold leading-6 text-[#083F92]">
                  ${(isFree ? 0 : totalAmount).toFixed(2)}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Between the bill and the pay button, so the total above is already
            the final one by the time someone presses it. */}
        {!isLoading ? (
          <div className="mb-5">
            <CouponField
              entryFee={totalAmount}
              validate={validateMembershipCoupon}
              coveringText="is covering your membership"
              hint="Your school or club may give you a code that covers the membership."
              showTotals={false}
              applied={appliedCoupon}
              onApplied={setAppliedCoupon}
              onCleared={() => setAppliedCoupon(null)}
              disabled={isPending}
              onCheckingChange={setIsCheckingCoupon}
            />
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => handleProceedToPayment(appliedCoupon?.code)}
          disabled={isPending || isLoading || isCheckingCoupon}
          className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-60 cursor-pointer"
        >
          {isPending
            ? isFree
              ? "Activating..."
              : "Redirecting..."
            : isFree
              ? "Activate Membership"
              : "Proceed To Payment"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setIsLogoutOpen(true)}
        className="h-12 w-full rounded-[24px] border border-[#083F92] bg-white text-sm font-semibold capitalize text-[#083F92] transition-colors hover:bg-[#083F92]/5 cursor-pointer shadow-sm"
      >
        Logout
      </button>

      <p className="text-sm font-semibold leading-[19px] text-black">
        Note: All memberships expire on August 31 each year and cover one player
        each.
      </p>

      {isLogoutOpen && (
        <LogoutConfirmModal
          onClose={() => setIsLogoutOpen(false)}
          onConfirm={() => {
            setIsLogoutOpen(false);
            logout();
          }}
        />
      )}
    </div>
  );
}
