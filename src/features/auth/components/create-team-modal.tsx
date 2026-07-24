"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CreateTeamModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateTeamModal({ open, onClose }: CreateTeamModalProps) {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent 
        showCloseButton={false}
        className="flex h-[24em] w-full max-w-[588px] flex-col items-center gap-[25px] rounded-xl bg-white px-4 py-[26px] border-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] !outline-none"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-md text-[#181818] transition-colors hover:bg-zinc-100"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h2
          id="create-team-title"
          className="mt-6 text-center text-[28px] font-bold capitalize leading-[38px] tracking-[-0.018em] text-[#181818]"
        >
          Team Creation Request
        </h2>

        <p className="w-full max-w-[524px] text-center text-base leading-[22px] tracking-[-0.014em] text-black">
          Lorem ipsum dolor sit amet consectetur. Sagittis aliquam tincidunt dignissim
          euismod in. Odio feugiat libero enim augue molestie non in amet. Lorem ipsum
          dolor sit amet consectetur. Sagittis aliquam tincidunt dignissim euismod in.
          Odio feugiat libero enim augue molestie non in amet. Lorem ipsum dolor sit
          amet consectetur. Sagittis aliquam tincidunt dignissim euismod in. Odio
          feugiat libero enim augue molestie non in amet.
        </p>

        <a
          href="#"
          className="text-center text-base font-semibold leading-[22px] tracking-[-0.014em] text-black underline"
        >
          Redirecting Link For Team Creation
        </a>
      </DialogContent>
    </Dialog>
  );
}
