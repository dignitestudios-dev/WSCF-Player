"use client";

import { Loader2 } from "lucide-react";
import { useMembershipCheckoutMutation } from "@/features/membership/api/membership.mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MembershipRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MembershipRequiredDialog({
  open,
  onOpenChange,
}: MembershipRequiredDialogProps) {
  const { mutate: checkout, isPending } = useMembershipCheckoutMutation();

  function handleConfirm() {
    checkout(
      {
        successUrl: window.location.origin + "/membership/success",
        cancelUrl: window.location.origin + "/membership/cancel",
      },
      {
        onSuccess: (data) => {
          if (data.url) {
            window.location.href = data.url;
          }
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#083F92]">Membership Required</DialogTitle>
          <DialogDescription className="text-base text-[#181818] opacity-70 mt-2">
            Please buy or renew your membership to register for tournaments.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="h-12 flex-1 rounded-[24px] bg-[#E7E7E8] text-base font-semibold capitalize leading-[22px] text-[#181818] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="h-12 flex-1 rounded-[24px] bg-[#083F92] text-base font-semibold capitalize leading-[22px] text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition hover:bg-[#063275] disabled:opacity-50"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading
              </span>
            ) : (
              "Buy / Renew"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
