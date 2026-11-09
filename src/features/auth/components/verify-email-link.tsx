"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useSendVerificationLinkMutation,
  useVerifyEmailLinkMutation,
} from "@/features/auth/api/auth.mutations";
import { DEFAULT_REDIRECT, MEMBER_LOGIN_ROUTE } from "@/config/routes";
import { AUTH_TOKEN_KEY } from "@/utils/constants";
import { showApiErrorToast, showApiSuccessToast } from "@/lib/api-toast";

type Status = "verifying" | "verified" | "failed";

function StatusIcon({ status }: { status: Status }) {
  const failed = status === "failed";
  return (
    <div
      className={`flex h-[120px] w-[120px] items-center justify-center rounded-full ${
        failed ? "bg-[#B42318]" : "bg-[#083F92]"
      }`}
    >
      {status === "verifying" ? (
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
      ) : failed ? (
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true">
          <path d="M17 17L33 33M33 17L17 33" stroke="white" strokeWidth="4" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true">
          <path
            d="M14 26L22 34L36 16"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

/**
 * Where the link in the verification email lands.
 *
 * Works signed in or out, and on any device: the link itself is the proof. The
 * link can only be used once, so it is sent exactly once — the guard below is
 * not optional, since development double-runs effects and the second request
 * would be refused and wrongly report the link as dead.
 */
export default function VerifyEmailLink() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useSearchParams().get("token") ?? "";

  const { mutate: verify } = useVerifyEmailLinkMutation();
  const { mutate: sendLink, isPending: isSending } =
    useSendVerificationLinkMutation();

  const [status, setStatus] = useState<Status>(token ? "verifying" : "failed");
  const [message, setMessage] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const hasSent = useRef(false);

  useEffect(() => {
    setSignedIn(Boolean(localStorage.getItem(AUTH_TOKEN_KEY)));

    if (!token || hasSent.current) return;
    hasSent.current = true;

    verify(token, {
      onSuccess: (response) => {
        setMessage(response.message);
        setStatus("verified");
        // The banner and every screen reading the account must stop saying
        // "not verified".
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      },
      onError: (error) => {
        setMessage(error.message);
        setStatus("failed");
      },
    });
  }, [token, verify, queryClient]);

  function requestNewLink() {
    sendLink(undefined, {
      onSuccess: (response) => {
        showApiSuccessToast(response, "Verification link sent");
        setLinkSent(true);
      },
      onError: (error) => {
        showApiErrorToast(error, "Could not send the verification link.");
      },
    });
  }

  const heading =
    status === "verifying"
      ? "Verifying your email..."
      : status === "verified"
        ? "Email Verified"
        : "Link not valid";

  const body =
    status === "verifying"
      ? "One moment."
      : status === "verified"
        ? "Thank you. You will now receive WSCF updates about your players, memberships and tournaments."
        : message ||
          "This link is invalid or has expired. Verification links work once and expire after 24 hours.";

  return (
    <div className="flex w-full flex-col items-center gap-[26px]">
      <StatusIcon status={status} />

      <div className="flex w-full flex-col items-center gap-3 text-center">
        <h1
          className={`text-[28px] font-semibold leading-9 ${
            status === "failed" ? "text-[#B42318]" : "text-[#083F92]"
          }`}
        >
          {heading}
        </h1>
        <p className="text-base leading-[22px] text-[#565656]">{body}</p>
      </div>

      {status !== "verifying" && (
        <div className="flex w-full flex-col gap-3">
          {status === "failed" && signedIn && !linkSent && (
            <button
              type="button"
              onClick={requestNewLink}
              disabled={isSending}
              className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-60"
            >
              {isSending ? "Sending..." : "Send me a new link"}
            </button>
          )}
          {linkSent && (
            <p className="text-center text-sm text-[#083F92]" role="status">
              A new link is on its way. Check your inbox.
            </p>
          )}
          <button
            type="button"
            onClick={() =>
              router.push(signedIn ? DEFAULT_REDIRECT : MEMBER_LOGIN_ROUTE)
            }
            className={`h-12 w-full rounded-[24px] text-sm font-semibold shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors ${
              status === "verified"
                ? "bg-[#083F92] text-white hover:bg-[#063875]"
                : "border border-[#083F92] bg-white text-[#083F92] hover:bg-[#F5F7FB]"
            }`}
          >
            {signedIn ? "Go to my account" : "Sign in"}
          </button>
          {status === "failed" && !signedIn && (
            <p className="text-center text-sm text-[#565656]">
              Sign in and use the banner at the top to get a new link.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
