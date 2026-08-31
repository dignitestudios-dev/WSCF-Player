"use client";

import { useRouter } from "next/navigation";
import { REGISTERED_TOURNAMENTS_ROUTE } from "@/config/routes";
import { usePaypalCapture } from "@/features/payment/use-paypal-capture";

/**
 * Where PayPal returns the buyer after a tournament entry fee.
 *
 * Arriving here proves a redirect happened and nothing more, so the payment is
 * captured and confirmed before anything congratulates anyone. The screen used
 * to declare success unconditionally, which meant a cancelled or failed payment
 * still read as "you are now registered".
 */
export default function PaymentSuccessContent() {
  const router = useRouter();
  const { state, message, retry } = usePaypalCapture();

  const handleContinue = () => {
    router.push(REGISTERED_TOURNAMENTS_ROUTE);
  };

  // `idle` means no order id in the URL. That is how the free-registration
  // flow reaches this page, so it keeps the original confirmation.
  const confirmed = state === "paid" || state === "idle";
  const failed = state === "failed";

  return (
    <div className="flex w-full flex-col items-center gap-[26px]">
      <div
        className={`flex h-[120px] w-[120px] items-center justify-center rounded-full ${
          failed ? "bg-[#B42318]" : "bg-[#083F92]"
        }`}
      >
        {state === "verifying" ? (
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true" className="animate-spin">
            <circle cx="25" cy="25" r="18" stroke="white" strokeWidth="4" strokeOpacity="0.25" />
            <path d="M43 25a18 18 0 0 0-18-18" stroke="white" strokeWidth="4" strokeLinecap="round" />
          </svg>
        ) : failed ? (
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
          {state === "verifying"
            ? "Confirming payment"
            : failed
              ? "Payment not completed"
              : state === "pending"
                ? "Almost there"
                : "Congratulations"}
        </h1>
        <p className="text-base leading-[22px] text-[#565656]">
          {state === "verifying"
            ? "Please wait while we confirm your payment with PayPal. Do not close this page."
            : message ||
              "Your tournament payment was successful! You are now registered."}
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        {failed && (
          <button
            type="button"
            onClick={retry}
            className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] cursor-pointer"
          >
            Try again
          </button>
        )}
        <button
          type="button"
          onClick={handleContinue}
          disabled={state === "verifying"}
          className={`h-12 w-full rounded-[24px] text-sm font-semibold capitalize shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
            failed
              ? "border border-[#083F92] bg-white text-[#083F92] hover:bg-[#F5F7FB]"
              : "bg-[#083F92] text-white hover:bg-[#063875]"
          }`}
        >
          View My Tournaments
        </button>
      </div>
    </div>
  );
}
