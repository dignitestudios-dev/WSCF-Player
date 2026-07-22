"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface TournamentPaymentSuccessModalProps {
  tournament: TournamentRegistrationTarget;
  onClose: () => void;
}

export default function TournamentPaymentSuccessModal({
  tournament,
  onClose,
}: TournamentPaymentSuccessModalProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent 
        showCloseButton={false}
        className="flex w-full max-w-[515px] flex-col items-center gap-[18px] rounded-[12px] px-10 py-[43px] border-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] !outline-none"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%), #FFFFFF",
        }}
      >
        <div className="flex w-full max-w-[428px] flex-col items-center justify-between gap-[22px]">
          <div className="flex flex-col items-center gap-8">
            <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#083F92]">
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true">
                <path
                  d="M14 26L22 34L36 16"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <h2
                id="tournament-payment-success-title"
                className="text-[32px] font-semibold capitalize leading-[43px] tracking-[-0.008em] text-[#181818]"
              >
                Payment Successfully
              </h2>
              <p className="text-lg leading-7 tracking-[-0.014em] text-[#565656]">
                You have paid {tournament.price} USD To {tournament.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875]"
          >
            Continue
          </button>
        </div>

        <p className="text-center text-base font-medium leading-[22px] tracking-[-0.014em] text-[#565656]">
          Thank you for the payment
        </p>
      </DialogContent>
    </Dialog>
  );
}
