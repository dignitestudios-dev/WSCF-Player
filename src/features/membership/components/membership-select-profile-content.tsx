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

export default function MembershipSelectProfileContent() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAttachDialogOpen, setIsAttachDialogOpen] = useState(false);
  const [isSkipDialogOpen, setIsSkipDialogOpen] = useState(false);

  const { data: suggestionsData, isLoading } = useMatchSuggestionsQuery();
  const { mutate: attachProfile, isPending: isAttaching } = useAttachProfileMutation();

  const matches = suggestionsData?.data?.matches || [];

  const handleRedirect = () => {
    const token =
      localStorage.getItem(AUTH_TOKEN_KEY) ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");
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
      <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#083F92] text-white">
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-user-search"
        >
          <circle cx="10" cy="7" r="4" />
          <path d="M10.3 15H7a4 4 0 0 0-4 4v2" />
          <circle cx="17" cy="17" r="3" />
          <path d="m21 21-1.9-1.9" />
        </svg>
      </div>

      <div className="flex w-full flex-col items-center gap-4 text-center">
        <h1 className="text-[32px] font-semibold capitalize leading-[39px] text-[#083F92]">
          Select Your Profile
        </h1>
        <p className="text-base leading-[22px] text-[#565656]">
          Link your historical WSCF data to your new membership account.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 p-8 w-full">
          <Loader2 className="h-8 w-8 animate-spin text-[#083F92]" />
          <p className="text-sm font-medium text-gray-500">Checking for matching profiles...</p>
        </div>
      ) : matches.length > 0 ? (
        <div className="flex w-full flex-col gap-4">
          <p className="text-sm font-medium text-[#181818] text-center">
            We found some matching profiles. Please select yours if you see it, or click Skip.
          </p>
          <div className="flex max-h-[300px] w-full flex-col gap-3 overflow-y-auto pr-2">
            {matches.map((match: any) => (
              <button
                key={match._id}
                type="button"
                disabled={isLoading}
                onClick={() => setSelectedId(match._id === selectedId ? null : match._id)}
                className={cn(
                  "flex flex-col gap-1 rounded-xl border p-4 text-left transition-colors cursor-pointer",
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
        <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 w-full text-center gap-2">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
          </svg>
          <p className="text-sm font-medium text-gray-500">
            No matching profiles found with your details.
          </p>
        </div>
      )}

      <div className="flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={handleContinue}
          disabled={isLoading || !selectedId}
          className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-60 cursor-pointer"
        >
          Attach Profile & Continue
        </button>

        <button
          type="button"
          onClick={() => setIsSkipDialogOpen(true)}
          disabled={isLoading}
          className="h-12 w-full rounded-[24px] border border-[#083F92] bg-white text-sm font-semibold capitalize text-[#083F92] transition-colors hover:bg-[#F7F6FF] disabled:opacity-60 cursor-pointer"
        >
          {matches.length > 0 ? "Skip" : "Continue to Dashboard"}
        </button>
      </div>

      <Dialog open={isAttachDialogOpen} onOpenChange={setIsAttachDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Profile Attachment</DialogTitle>
            <DialogDescription>
              Are you sure you want to attach this profile to your account? This action will link the
              selected historical data to your new membership.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <button
              type="button"
              onClick={() => setIsAttachDialogOpen(false)}
              className="h-10 rounded-[24px] px-6 text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
              disabled={isAttaching}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmAttach}
              disabled={isAttaching}
              className="h-10 rounded-[24px] bg-[#083F92] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#063875] disabled:opacity-60 flex items-center gap-2 cursor-pointer"
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
            <DialogTitle>
              {matches.length > 0 ? "Skip Profile Attachment" : "Continue to Dashboard"}
            </DialogTitle>
            <DialogDescription>
              {matches.length > 0
                ? "Are you sure you want to skip linking a profile? You will continue to the dashboard with a new blank profile."
                : "You will be redirected to your dashboard now."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <button
              type="button"
              onClick={() => setIsSkipDialogOpen(false)}
              className="h-10 rounded-[24px] px-6 text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSkip}
              className="h-10 rounded-[24px] bg-[#083F92] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#063875] cursor-pointer"
            >
              {matches.length > 0 ? "Confirm Skip" : "Continue"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
