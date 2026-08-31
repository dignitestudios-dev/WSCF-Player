"use client";

import { useRouter } from "next/navigation";
import { useActivePlayer } from "@/features/players/use-active-player";
import {
  CLAIM_RATINGS_ROUTE,
  SELECT_PLAYER_ROUTE,
} from "@/features/players/routes";
import { DEFAULT_REDIRECT } from "@/config/routes";
import { usePaypalCapture } from "@/features/payment/use-paypal-capture";

/**
 * Where PayPal returns the buyer after a membership payment.
 *
 * The payment is captured and confirmed here before anything says it worked:
 * arriving on this URL proves a redirect happened, not that money moved. Once
 * confirmed, what happens next depends on what is still outstanding, so this
 * screen hands over rather than jumping straight to a dashboard the parent has
 * not yet chosen an occupant for.
 */
export default function MembershipSuccessContent() {
  const router = useRouter();
  const { children, needsMasterFileCheck, isLoading } = useActivePlayer();
  const { state, message, retry } = usePaypalCapture();

  const playerCount = children.length;

  const handleContinue = () => {
    // Ratings first: every player has to be answered for before the app can
    // meaningfully show any of them.
    if (needsMasterFileCheck) {
      router.push(CLAIM_RATINGS_ROUTE);
      return;
    }

    router.push(playerCount > 1 ? SELECT_PLAYER_ROUTE : DEFAULT_REDIRECT);
  };

  // The account is re-read on arrival — how many players were just paid for,
  // and whether any lookups are still outstanding, both come from it. Showing
  // the finished screen before that lands would state a player count that then
  // changes under the reader.
  if (isLoading || state === "verifying") {
    return (
      <div className="flex w-full flex-col items-center gap-[26px]">
        <div className="h-[120px] w-[120px] animate-pulse rounded-full bg-[#F2F2F2]" />
        <div className="flex w-full flex-col items-center gap-4">
          <div className="h-8 w-3/5 animate-pulse rounded-full bg-[#F2F2F2]" />
          <div className="h-4 w-4/5 animate-pulse rounded-full bg-[#F2F2F2]" />
        </div>
        <div className="h-12 w-full animate-pulse rounded-[24px] bg-[#F2F2F2]" />
      </div>
    );
  }

  const failed = state === "failed";
  // `idle` means no order id in the URL, which is how this page is reached
  // when nothing needed paying.
  const confirmed = state === "paid" || state === "idle";

  return (
    <div className="flex w-full flex-col items-center gap-[26px]">
      <div
        className={`flex h-[120px] w-[120px] items-center justify-center rounded-full ${
          failed ? "bg-[#B42318]" : "bg-[#083F92]"
        }`}
      >
        {failed ? (
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true">
            <path d="M17 17L33 33M33 17L17 33" stroke="white" strokeWidth="4" strokeLinecap="round" />
          </svg>
        ) : confirmed ? (
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true">
            <path
              d="M14 26L22 34L36 16"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true">
            <circle cx="25" cy="25" r="18" stroke="white" strokeWidth="4" />
            <path d="M25 16v10l6 4" stroke="white" strokeWidth="4" strokeLinecap="round" />
          </svg>
        )}
      </div>

      <div className="flex w-full flex-col items-center gap-4 text-center">
        <h1
          className={`text-[32px] font-semibold capitalize leading-[39px] ${
            failed ? "text-[#B42318]" : "text-[#083F92]"
          }`}
        >
          {failed
            ? "Payment not completed"
            : state === "pending"
              ? "Almost there"
              : "Congratulations"}
        </h1>
        <p className="text-base leading-[22px] text-[#565656]">
          {message ||
            (playerCount > 1
              ? `Memberships for all ${playerCount} players are now active.`
              : "Your membership payment was successful!")}
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        {failed && (
          <button
            type="button"
            onClick={retry}
            className="h-12 w-full cursor-pointer rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875]"
          >
            Try again
          </button>
        )}
        <button
          type="button"
          onClick={handleContinue}
          className={`h-12 w-full cursor-pointer rounded-[24px] text-sm font-semibold capitalize shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors ${
            failed
              ? "border border-[#083F92] bg-white text-[#083F92] hover:bg-[#F5F7FB]"
              : "bg-[#083F92] text-white hover:bg-[#063875]"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
