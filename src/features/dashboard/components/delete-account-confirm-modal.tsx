"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface DeleteAccountConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteAccountConfirmModal({
  onClose,
  onConfirm,
}: DeleteAccountConfirmModalProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent 
        showCloseButton={false}
        className="flex w-full max-w-[462px] flex-col items-center justify-center gap-[26px] rounded-[12px] px-5 py-[50px] border-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] !outline-none"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%), #FFFFFF",
        }}
      >
        <div className="flex w-full max-w-[422px] flex-col items-center gap-2 text-center">
          <h2
            id="delete-account-confirm-title"
            className="w-full text-[32px] font-bold capitalize leading-[43px] tracking-[-0.0041em] text-[#181818]"
          >
            Delete Account
          </h2>
          <p className="w-full text-2xl leading-[34px] tracking-[-0.008em] text-[rgba(24,24,24,0.5)]">
            Are you sure you want to Delete this account?
          </p>
        </div>

        <div className="flex w-full max-w-[422px] gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-full bg-[#E7E7E8] text-base font-semibold capitalize leading-[22px] text-[#181818]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-12 flex-1 rounded-[24px] bg-[#083F92] text-base font-semibold capitalize leading-[22px] text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)]"
          >
            Delete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
