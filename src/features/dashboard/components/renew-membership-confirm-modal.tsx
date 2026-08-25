"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMembershipCheckoutMutation } from "@/features/membership/api/membership.mutations";

interface RenewMembershipConfirmModalProps {
  /** False when the account has never held a membership: buying, not renewing. */
  hasMembership?: boolean;
  onClose: () => void;
}

export default function RenewMembershipConfirmModal({
  onClose,
  hasMembership = true,
}: RenewMembershipConfirmModalProps) {
  const title = hasMembership ? "Renew Membership" : "Become a Member";
  const question = hasMembership
    ? "Are you sure you want to renew your membership?"
    : "Are you sure you want to buy a membership?";
  const confirmLabel = hasMembership ? "Renew Now" : "Buy Membership";

  const router = useRouter();
  const { mutate: checkout, isPending } = useMembershipCheckoutMutation();

  function handleConfirm() {
    checkout(
      { successUrl: window.location.origin + "/membership/success", cancelUrl: window.location.origin + "/membership/cancel" },
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
    <Dialog open={true} onOpenChange={(open) => { if (!open && !isPending) onClose(); }}>
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
            id="renew-membership-confirm-title"
            className="w-full text-[32px] font-bold capitalize leading-[43px] tracking-[-0.0041em] text-[#181818]"
          >
            {title}
          </h2>
          <p className="w-full text-2xl leading-[34px] tracking-[-0.008em] text-[rgba(24,24,24,0.5)]">
            {question}
          </p>
        </div>

        <div className="flex w-full max-w-[422px] gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-12 flex-1 rounded-[24px] bg-[#E7E7E8] text-base font-semibold capitalize leading-[22px] text-[#181818] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="h-12 flex-1 rounded-[24px] bg-[#083F92] text-base font-semibold capitalize leading-[22px] text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] disabled:opacity-50"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
