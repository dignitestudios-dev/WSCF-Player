"use client";

import { useEffect } from "react";

interface PasswordUpdatedModalProps {
  onClose: () => void;
}

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

export default function PasswordUpdatedModal({ onClose }: PasswordUpdatedModalProps) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative flex w-full max-w-[515px] flex-col items-center gap-8 rounded-[12px] bg-white px-6 py-10"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-updated-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center text-[#181818]"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#083F92]">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path
              d="M10 20L17 27L30 13"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <h2
            id="password-updated-title"
            className="text-[36px] font-semibold capitalize leading-[44px] tracking-[-0.008em] text-black"
          >
            Password Updated!
          </h2>
          <p className="text-base leading-[19px] tracking-[-0.014em] text-[#565656]">
            Your password has been updated successfully.
          </p>
        </div>
      </div>
    </div>
  );
}
