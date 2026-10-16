"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { DEFAULT_REDIRECT } from "@/config/routes";
import { useMembershipCheckoutMutation } from "@/features/membership/api/membership.mutations";
import {
  MEMBERSHIP_CANCEL_ROUTE,
  MEMBERSHIP_SUCCESS_ROUTE,
} from "@/features/membership/constants/routes";
import {
  showApiErrorToast,
  showApiSuccessToast,
} from "@/lib/api-toast";

export function useMembershipCheckout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: startCheckout, isPending } = useMembershipCheckoutMutation();

  /**
   * Starts PayPal checkout — or, with an organization's code that covers the
   * whole bill, activates the memberships on the spot and goes to the
   * dashboard, because there is nothing left to pay.
   */
  function handleProceedToPayment(couponCode?: string) {
    const origin = window.location.origin;

    startCheckout(
      {
        successUrl: `${origin}${MEMBERSHIP_SUCCESS_ROUTE}`,
        cancelUrl: `${origin}${MEMBERSHIP_CANCEL_ROUTE}`,
        ...(couponCode ? { couponCode } : {}),
      },
      {
        onSuccess: (response) => {
          if (response.requiresPayment === false) {
            // AuthGuard routes on the account payload, so it has to be read
            // again or the cached "still owes money" would bounce the parent
            // straight back here. The account is REMOVED rather than just marked
            // stale: with it gone the dashboard waits for a fresh copy, which
            // is also what lets it read which player was chosen. Left cached,
            // the guard decides before that and sends a parent with several
            // players back to the picker.
            ["authUser", "children"].forEach((key) =>
              queryClient.removeQueries({ queryKey: [key] }),
            );
            ["membership", "myTournaments", "tournaments", "notifications"].forEach(
              (key) => queryClient.invalidateQueries({ queryKey: [key] }),
            );

            showApiSuccessToast(response, "Membership activated");
            router.replace(DEFAULT_REDIRECT);
            return;
          }

          if (response.url) {
            window.location.href = response.url;
            return;
          }

          showApiSuccessToast(response, "Redirecting to checkout...");
        },
        onError: (error) => {
          showApiErrorToast(error, "Failed to start payment. Please try again.");
        },
      }
    );
  }

  return {
    handleProceedToPayment,
    isPending,
  };
}
