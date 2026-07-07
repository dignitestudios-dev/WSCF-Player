"use client";

import { useEffect } from "react";

interface LogoutConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmModal({ onClose, onConfirm }: LogoutConfirmModalProps) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex w-full max-w-[462px] flex-col items-center justify-center gap-[26px] rounded-[12px] px-5 py-[50px]"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%), #FFFFFF",
        }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
      >
        <div className="flex w-full max-w-[422px] flex-col items-center gap-2 text-center">
          <h2
            id="logout-confirm-title"
            className="w-full text-[32px] font-bold capitalize leading-[43px] tracking-[-0.0041em] text-[#181818]"
          >
            Log Out
          </h2>
          <p className="w-full text-2xl leading-[34px] tracking-[-0.008em] text-[rgba(24,24,24,0.5)]">
            Are you sure you want to log out?
          </p>
        </div>

        <div className="flex w-full max-w-[422px] gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-[24px] bg-[#E7E7E8] text-base font-semibold capitalize leading-[22px] text-[#181818]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-12 flex-1 rounded-[24px] bg-[#083F92] text-base font-semibold capitalize leading-[22px] text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)]"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
