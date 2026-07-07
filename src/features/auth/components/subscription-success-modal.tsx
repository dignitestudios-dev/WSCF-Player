"use client";

interface SubscriptionSuccessModalProps {
  open: boolean;
  onContinue: () => void;
}

export default function SubscriptionSuccessModal({
  open,
  onContinue,
}: SubscriptionSuccessModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="presentation"
    >
      <div
        className="flex w-full max-w-[515px] flex-col items-center gap-[22px] rounded-xl bg-white px-[44px] py-[43px]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscription-success-title"
      >
        <div className="flex w-full max-w-[428px] flex-col items-center gap-8">
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

          <div className="flex w-full flex-col items-center gap-4 text-center">
            <h2
              id="subscription-success-title"
              className="text-[32px] font-semibold capitalize leading-[39px] tracking-[-0.008em] text-[#181818]"
            >
              Congratulations
            </h2>
            <p className="text-base leading-[22px] tracking-[-0.014em] text-[#565656]">
              Your account has been created successfully!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="h-12 w-full max-w-[428px] rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
