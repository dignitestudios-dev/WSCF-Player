"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PayPalIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.5 7.5H18.5C19.3 7.5 20 8.2 19.9 9L18.8 15.5C18.7 16.2 18.1 16.7 17.4 16.7H13.2L13.8 12.5H16.5C17 12.5 17.4 12.1 17.5 11.6L17.9 9.2C18 8.7 17.6 8.3 17.1 8.3H14.4L15 4.5H11.8C11.1 4.5 10.5 5 10.4 5.7L8.5 7.5Z"
        fill="#000000"
      />
      <path
        d="M6.5 4.5H10.8C11.5 4.5 12.1 5 12.2 5.7L11.5 10.5H7.8C7.1 10.5 6.5 10 6.4 9.3L5.5 5.1C5.4 4.4 5.9 3.8 6.5 4.5Z"
        fill="#000000"
      />
    </svg>
  );
}

interface TournamentPaymentModalProps {
  tournament: TournamentRegistrationTarget;
  onClose: () => void;
  onPay: () => void;
}

export default function TournamentPaymentModal({
  tournament,
  onClose,
  onPay,
}: TournamentPaymentModalProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent 
        showCloseButton={false}
        className="relative flex w-full max-w-[515px] flex-col rounded-[12px] p-10 border-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] !outline-none"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%), #FFFFFF",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center text-[#181818]"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className="flex flex-col gap-[33px]">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <h2 id="tournament-payment-title" className="text-[32px] font-semibold leading-[43px] text-[#181818]">
              Payment
            </h2>
            <p className="text-base font-medium leading-[22px] text-black">
              Secure payment powered by PayPal
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-[22px]">
              <div className="rounded-[12px] border border-[#DADADA] bg-white p-3">
                <p className="mb-4 text-lg font-medium leading-6 text-[#181818]">Order Summary</p>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium leading-[19px] text-[#181818]">Total Payment</span>
                  <span className="text-[22px] font-semibold leading-[30px] text-[#083F92]">
                    {tournament.price}
                  </span>
                </div>
              </div>

              <div className="flex h-[58px] items-center gap-3 rounded-[12px] border border-[#DADADA] bg-white px-3">
                <PayPalIcon />
                <span className="text-[22px] font-medium leading-[30px] text-[#181818]">PayPal</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onPay}
              className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875]"
            >
              Pay Now
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
