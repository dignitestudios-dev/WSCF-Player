"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSendVerificationLinkMutation } from "@/features/auth/api/auth.mutations";
import { DEFAULT_REDIRECT } from "@/config/routes";
import { CLAIM_RATINGS_ROUTE, SELECT_PLAYER_ROUTE } from "@/features/players/routes";
import { markVerifyPromptSeen } from "@/features/auth/verify-prompt";
import { useActivePlayer } from "@/features/players/use-active-player";
import { showApiErrorToast, showApiSuccessToast } from "@/lib/api-toast";

/**
 * The step after the first payment: "verify your email", which can be skipped.
 *
 * Verifying is optional, so nothing here blocks anyone. Either button ends in
 * the same place; the only difference is whether a link was sent first. The
 * banner on the dashboard keeps offering it until it is done.
 */
export default function VerifyEmailPrompt() {
  const router = useRouter();
  const { account, children, needsMasterFileCheck, isLoading } = useActivePlayer();
  const { mutate: sendLink, isPending } = useSendVerificationLinkMutation();
  const [sent, setSent] = useState(false);

  // Same order as before the prompt existed: ratings first, then the picker
  // if there is a choice, otherwise the dashboard.
  const destination = needsMasterFileCheck
    ? CLAIM_RATINGS_ROUTE
    : children.length > 1
      ? SELECT_PLAYER_ROUTE
      : DEFAULT_REDIRECT;
  const alreadyVerified = Boolean(account?.isEmailVerified);

  useEffect(() => {
    markVerifyPromptSeen(account?._id);
  }, [account?._id]);

  // Nothing to ask someone who has already done it.
  useEffect(() => {
    if (!isLoading && alreadyVerified) router.replace(destination);
  }, [isLoading, alreadyVerified, destination, router]);

  function handleSend() {
    sendLink(undefined, {
      onSuccess: (response) => {
        showApiSuccessToast(response, "Verification link sent");
        setSent(true);
      },
      onError: (error) => {
        showApiErrorToast(error, "Could not send the verification link.");
      },
    });
  }

  if (isLoading || alreadyVerified) {
    return (
      <div className="flex w-full flex-col items-center gap-[26px]">
        <div className="h-[120px] w-[120px] animate-pulse rounded-full bg-[#F2F2F2]" />
        <div className="h-8 w-3/5 animate-pulse rounded-full bg-[#F2F2F2]" />
        <div className="h-12 w-full animate-pulse rounded-[24px] bg-[#F2F2F2]" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-[26px]">
      <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#083F92]">
        <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      </div>

      <div className="flex w-full flex-col items-center gap-3 text-center">
        <h1 className="text-[28px] font-semibold leading-9 text-[#083F92]">
          Verify your email
        </h1>
        <p className="text-base leading-[22px] text-[#565656]">
          {sent ? (
            <>
              We sent a link to{" "}
              <strong className="break-all text-[#181818]">{account?.email}</strong>
              . Open it whenever you like. You can carry on now.
            </>
          ) : (
            <>
              Get updates about your players, memberships and tournaments. It
              takes one click, and you can skip this and do it any time.
            </>
          )}
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        {!sent && (
          <button
            type="button"
            onClick={handleSend}
            disabled={isPending}
            className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-60"
          >
            {isPending ? "Sending..." : "Send me the link"}
          </button>
        )}
        <button
          type="button"
          onClick={() => router.push(destination)}
          className={`h-12 w-full rounded-[24px] text-sm font-semibold shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors ${
            sent
              ? "bg-[#083F92] text-white hover:bg-[#063875]"
              : "border border-[#083F92] bg-white text-[#083F92] hover:bg-[#F5F7FB]"
          }`}
        >
          {sent ? "Continue" : "Skip for now"}
        </button>
      </div>
    </div>
  );
}
