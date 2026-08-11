"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_REDIRECT } from "@/config/routes";
import { AUTH_TOKEN_KEY, TOKEN_MAX_AGE_SECONDS } from "@/utils/constants";
import { useMatchSuggestionsQuery } from "@/features/players/api/players.queries";
import { useAttachProfileMutation } from "@/features/players/api/players.mutations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { showApiErrorToast, showApiSuccessToast } from "@/lib/api-toast";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MembershipSuccessContent() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAttachDialogOpen, setIsAttachDialogOpen] = useState(false);
  const [isSkipDialogOpen, setIsSkipDialogOpen] = useState(false);

  const { data: suggestionsData, isLoading } = useMatchSuggestionsQuery();
  const { mutate: attachProfile, isPending: isAttaching } = useAttachProfileMutation();

  const matches = suggestionsData?.data?.matches || [];

  const handleRedirect = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (token) {
      document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=${TOKEN_MAX_AGE_SECONDS}`;
    }
    router.push(DEFAULT_REDIRECT);
  };

  const handleContinue = () => {
    if (selectedId) {
      setIsAttachDialogOpen(true);
    }
  };

  const handleConfirmAttach = () => {
    if (!selectedId) return;

    attachProfile(
      { masterPlayerId: selectedId },
      {
        onSuccess: (res) => {
          showApiSuccessToast(res, "Profile attached successfully");
          setIsAttachDialogOpen(false);
          handleRedirect();
        },
        onError: (error) => {
          showApiErrorToast(error, "Failed to attach profile");
          setIsAttachDialogOpen(false);
        },
      }
    );
  };

  const handleConfirmSkip = () => {
    setIsSkipDialogOpen(false);
    handleRedirect();
  };

  return (
    <div className="flex w-full flex-col items-center gap-[26px]">
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
        <h1 className="text-[32px] font-semibold capitalize leading-[39px] text-[#083F92]">
          Congratulations
        </h1>
        <p className="text-base leading-[22px] text-[#565656]">
          Your membership payment was successful!
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-[#083F92]" />
        </div>
      ) : matches.length > 0 ? (
        <div className="flex w-full flex-col gap-4">
          <p className="text-sm font-medium text-[#181818] text-center">
            We found some matching profiles. Please select yours if you see it, or just continue.
          </p>
          <div className="flex max-h-[300px] w-full flex-col gap-3 overflow-y-auto pr-2">
            {matches.map((match: any) => (
              <button
                key={match._id}
                type="button"
                disabled={isLoading}
                onClick={() => setSelectedId(match._id === selectedId ? null : match._id)}
                className={cn(
                  "flex flex-col gap-1 rounded-xl border p-4 text-left transition-colors",
                  selectedId === match._id
                    ? "border-[#083F92] bg-[#ECEAFF]"
                    : "border-gray-200 bg-white hover:border-[#083F92]/50"
                )}
              >
                <div className="font-semibold text-[#181818]">
                  {match.firstName} {match.lastName}
                </div>
                <div className="text-sm text-gray-600">
                  Rating: {match.localRating} • Grade: {match.grade} • Team: {match.team}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm font-medium text-gray-500 text-center">
          No suggestion found.
        </p>
      )}

      <div className="flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={handleContinue}
          disabled={isLoading || !selectedId}
          className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-60"
        >
          Attach Profile & Continue
        </button>

        <button
          type="button"
          onClick={() => setIsSkipDialogOpen(true)}
          disabled={isLoading}
          className="h-12 w-full rounded-[24px] border border-[#083F92] bg-white text-sm font-semibold capitalize text-[#083F92] transition-colors hover:bg-[#F7F6FF] disabled:opacity-60"
        >
          Skip
        </button>
      </div>

      <Dialog open={isAttachDialogOpen} onOpenChange={setIsAttachDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Profile Attachment</DialogTitle>
            <DialogDescription>
              Are you sure you want to attach this profile to your account? This action will link the selected historical data to your new membership.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <button
              type="button"
              onClick={() => setIsAttachDialogOpen(false)}
              className="h-10 rounded-[24px] px-6 text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
              disabled={isAttaching}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmAttach}
              disabled={isAttaching}
              className="h-10 rounded-[24px] bg-[#083F92] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#063875] disabled:opacity-60 flex items-center gap-2"
            >
              {isAttaching && <Loader2 className="h-4 w-4 animate-spin" />}
              {isAttaching ? "Attaching..." : "Confirm"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSkipDialogOpen} onOpenChange={setIsSkipDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Skip Profile Attachment</DialogTitle>
            <DialogDescription>
              Are you sure you want to skip?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <button
              type="button"
              onClick={() => setIsSkipDialogOpen(false)}
              className="h-10 rounded-[24px] px-6 text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSkip}
              className="h-10 rounded-[24px] bg-[#083F92] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#063875]"
            >
              Confirm Skip
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
