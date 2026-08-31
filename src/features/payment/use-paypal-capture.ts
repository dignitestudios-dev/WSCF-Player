"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

/**
 * Confirms a PayPal payment when the buyer lands back on a success page.
 *
 * PayPal is two-phase: approving moves no money, capturing does. Landing here
 * proves only that a redirect happened, so this asks our own server to capture
 * and reports what the server says. Nothing on screen may claim success before
 * that answer arrives.
 *
 * PayPal appends `?token=<orderId>` to the return URL.
 *
 * Capturing is idempotent server-side, so a refresh, a double mount in React
 * strict mode, or the webhook having already settled it all end the same way.
 */
export type CaptureState =
  | "idle"        // no order id in the URL — nothing to confirm
  | "verifying"
  | "paid"
  | "pending"     // PayPal has not finished; it should settle shortly
  | "failed";

interface CaptureResult {
  state: CaptureState;
  message: string | null;
  /** Try again after a failure that might be transient. */
  retry: () => void;
}

const POLL_DELAY_MS = 2000;
const MAX_POLLS = 2;

/**
 * Pulls PayPal's order id out of the current URL.
 *
 * Normally `?token=` is a well-formed query parameter. But our tournament
 * return URL already carries `?payment=success`, and PayPal appending its own
 * parameter to a URL that already has a query is behaviour we cannot verify
 * from the server side — PayPal does not echo the return URL back. If it ever
 * produced `?payment=success?token=abc`, the standard parser would return null
 * and the payment would silently never be captured.
 *
 * So: try the parser first, and fall back to finding the token anywhere in the
 * raw query. Costs nothing and removes the unknown entirely.
 */
const readOrderId = (params: URLSearchParams): string | null => {
  const direct = params.get("token");
  if (direct) return direct;

  if (typeof window === "undefined") return null;
  const match = window.location.search.match(/[?&]token=([^&?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export function usePaypalCapture(): CaptureResult {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const fromUrl = readOrderId(searchParams as unknown as URLSearchParams);

  // Latched on first sight and never cleared.
  //
  // Some screens strip the query string as soon as they have read it, so that
  // a refresh does not replay the outcome. Reading the param directly would
  // then reset this hook to "idle" mid-flight and throw away the result of a
  // capture that is still running.
  const latched = useRef<string | null>(null);
  if (fromUrl && !latched.current) latched.current = fromUrl;
  const orderId = latched.current;

  const [state, setState] = useState<CaptureState>(orderId ? "verifying" : "idle");
  const [message, setMessage] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Guards the double invocation React runs in development.
  const inFlight = useRef(false);

  useEffect(() => {
    if (!orderId) {
      setState("idle");
      return;
    }
    if (inFlight.current) return;
    inFlight.current = true;

    let cancelled = false;
    let polls = 0;

    const finish = (next: CaptureState, text: string | null) => {
      if (cancelled) return;
      setState(next);
      setMessage(text);

      // A successful capture changes what the account owes, and AuthGuard
      // routes on exactly that. Without this the cached /user/me still reads
      // `needsMembershipPayment: true` and bounces the parent straight back to
      // the payment screen they just paid on -- which then correctly quotes
      // them $0, because the quote is fresh and the account payload is not.
      if (next === "paid") {
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        queryClient.invalidateQueries({ queryKey: ["membership", "quote"] });
      }
    };

    const poll = async () => {
      // The webhook may settle it a moment after we asked. Ask our own
      // database rather than PayPal — cheap, and it is the source of truth.
      try {
        const { data } = await axiosInstance.get(
          `/payment/paypal/order/${encodeURIComponent(orderId)}`,
        );
        if (data?.data?.paid) return finish("paid", null);
        if (data?.data?.status === "declined") {
          return finish("failed", "The payment was declined. Nothing has been charged.");
        }
      } catch {
        // Fall through to the pending message below.
      }

      polls += 1;
      if (polls < MAX_POLLS && !cancelled) {
        setTimeout(poll, POLL_DELAY_MS);
        return;
      }
      finish(
        "pending",
        "PayPal is still processing this payment. It will complete shortly — you do not need to pay again.",
      );
    };

    const run = async () => {
      try {
        const { data } = await axiosInstance.post("/payment/paypal/capture", {
          orderId,
        });

        const result = data?.data;
        if (result?.paid) return finish("paid", null);

        if (result?.status === "pending") {
          setTimeout(poll, POLL_DELAY_MS);
          return;
        }

        finish(
          "failed",
          data?.message || "We could not confirm this payment.",
        );
      } catch (error: any) {
        const status = error?.response?.status;
        const serverMessage = error?.response?.data?.message;

        // 403 means the order is not this account's; 404 that we have no
        // record of it. Both are dead ends, not worth retrying.
        finish(
          "failed",
          serverMessage ||
            (status === 403 || status === 404
              ? "We could not find this payment on your account."
              : "We could not confirm this payment. Please try again."),
        );
      } finally {
        inFlight.current = false;
      }
    };

    setState("verifying");
    run();

    return () => {
      cancelled = true;
    };
  }, [orderId, attempt, queryClient]);

  return {
    state,
    message,
    retry: () => {
      inFlight.current = false;
      setAttempt((n) => n + 1);
    },
  };
}
