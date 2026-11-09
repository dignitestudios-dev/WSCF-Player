"use client";

import { useEffect, useState } from "react";
import { useSendVerificationLinkMutation } from "@/features/auth/api/auth.mutations";
import ChangeEmailDialog from "@/features/auth/components/change-email-dialog";
import { useActivePlayer } from "@/features/players/use-active-player";
import { showApiErrorToast, showApiSuccessToast } from "@/lib/api-toast";

const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Sits at the top of the dashboard until the parent's email is verified.
 *
 * Verifying is optional, so this nudges rather than blocks: it says why (to get
 * updates), offers to send the link, and offers to correct the address, which
 * is also their sign-in email. It disappears on its own once the account reads
 * as verified.
 */
export default function EmailVerificationBanner() {
  const { account, isLoading } = useActivePlayer();
  const { mutate: sendLink, isPending } = useSendVerificationLinkMutation();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [isChangeOpen, setIsChangeOpen] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  if (isLoading || !account || account.isEmailVerified) return null;

  const email: string = account.email ?? "";

  function handleSend() {
    sendLink(undefined, {
      onSuccess: (response) => {
        showApiSuccessToast(response, "Verification link sent");
        setSentTo(email);
        setCooldown(RESEND_COOLDOWN_SECONDS);
      },
      onError: (error) => {
        showApiErrorToast(error, "Could not send the verification link.");
      },
    });
  }

  const justSent = sentTo !== null && sentTo === email;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="w-full border-b border-[#BFD3F2] bg-[#EAF1FB] text-[#083F92]"
    >
      <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-6 py-3 text-sm leading-5 sm:flex-row sm:items-center lg:px-0">
        <div className="flex flex-1 items-start gap-3">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#083F92]/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </div>
          <p className="font-medium">
            {justSent ? (
              <>
                We sent a verification link to{" "}
                <strong className="break-all font-semibold">{email}</strong>.
                Open it to finish.
              </>
            ) : (
              <>
                <strong className="font-semibold">Verify your email</strong> to
                get updates about your players and tournaments. Your sign-in
                email is{" "}
                <strong className="break-all font-semibold">{email}</strong>.
              </>
            )}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSend}
            disabled={isPending || cooldown > 0}
            className="h-9 rounded-full bg-[#083F92] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#063875] disabled:opacity-60"
          >
            {isPending
              ? "Sending..."
              : cooldown > 0
                ? `Resend in ${cooldown}s`
                : justSent
                  ? "Resend link"
                  : "Send verification link"}
          </button>
          <button
            type="button"
            onClick={() => setIsChangeOpen(true)}
            className="h-9 rounded-full border border-[#083F92] bg-white px-4 text-xs font-semibold text-[#083F92] transition-colors hover:bg-[#F5F7FB]"
          >
            Change email
          </button>
        </div>
      </div>

      <ChangeEmailDialog
        open={isChangeOpen}
        onOpenChange={setIsChangeOpen}
        currentEmail={email}
        onChanged={() => {
          // The link now goes to the new address; start the cooldown from the
          // send that just happened.
          setSentTo(null);
          setCooldown(RESEND_COOLDOWN_SECONDS);
        }}
      />
    </aside>
  );
}
