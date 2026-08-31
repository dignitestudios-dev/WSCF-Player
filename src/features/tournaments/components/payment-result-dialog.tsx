"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PaymentResultDialogProps {
  outcome: "success" | "cancelled";
  onClose: () => void;
}

function SuccessIcon() {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true">
      <path
        d="M14 26L22 34L36 16"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CancelledIcon() {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true">
      <path
        d="M16 16L34 34M34 16L16 34"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Shown on the registered tournaments page when PayPal sends the player back.
 *
 * A dialog rather than a standalone page, so the player lands on their list —
 * already refreshed with the new registration — instead of a dead end they have
 * to navigate away from.
 */
export default function PaymentResultDialog({
  outcome,
  onClose,
}: PaymentResultDialogProps) {
  const isSuccess = outcome === "success";

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="flex w-full max-w-[515px] flex-col items-center gap-[26px] rounded-[12px] border-none px-10 py-[43px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] !outline-none"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%), #FFFFFF",
        }}
      >
        <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#083F92]">
          {isSuccess ? <SuccessIcon /> : <CancelledIcon />}
        </div>

        <div className="flex w-full flex-col items-center gap-4 text-center">
          <h2 className="text-[32px] font-semibold capitalize leading-[43px] tracking-[-0.008em] text-[#181818]">
            {isSuccess ? "Payment Successful" : "Payment Cancelled"}
          </h2>
          <p className="text-lg leading-7 tracking-[-0.014em] text-[#565656]">
            {isSuccess
              ? "You are now registered. Your tournament is listed below."
              : "Your payment was not completed, so you have not been registered for this tournament. You can register again from the tournaments page."}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="h-12 w-full rounded-[24px] bg-[#083F92] text-base font-semibold capitalize leading-[22px] text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875]"
        >
          {isSuccess ? "View My Tournaments" : "Close"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
