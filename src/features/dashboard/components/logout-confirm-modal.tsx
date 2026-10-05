"use client";

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";

interface LogoutConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmModal({ onClose, onConfirm }: LogoutConfirmModalProps) {
  return (
    <ResponsiveDialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <ResponsiveDialogContent 
        showCloseButton={false}
        className="flex w-full max-w-[462px] flex-col items-center justify-center gap-[26px] rounded-[12px] px-5 py-[50px] border-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] !outline-none"
        mobileClassName="items-center justify-center gap-5"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%), #FFFFFF",
        }}
      >
        <ResponsiveDialogHeader className="flex w-full max-w-[422px] flex-col items-center gap-2 text-center">
          <ResponsiveDialogTitle
            id="logout-confirm-title"
            className="w-full text-2xl sm:text-[32px] font-bold capitalize leading-8 sm:leading-[43px] tracking-[-0.0041em] text-[#181818]"
          >
            Log Out
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="w-full text-2xl leading-[34px] tracking-[-0.008em] text-[rgba(24,24,24,0.5)]">
            Are you sure you want to log out?
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogFooter className="flex w-full max-w-[422px] gap-2 sm:justify-center border-none bg-transparent p-0 m-0">
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
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
