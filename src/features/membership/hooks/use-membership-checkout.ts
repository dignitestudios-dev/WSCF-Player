"use client";

import { useQueryClient } from "@tanstack/react-query";
import { DEFAULT_REDIRECT } from "@/config/routes";
import { useMembershipCheckoutMutation } from "@/features/membership/api/membership.mutations";
import {
  MEMBERSHIP_CANCEL_ROUTE,
  MEMBERSHIP_SUCCESS_ROUTE,
} from "@/features/membership/constants/routes";
import { SELECT_PLAYER_ROUTE } from "@/features/players/routes";
import { useActivePlayer } from "@/features/players/use-active-player";
import { setActiveProfileId } from "@/features/players/active-profile";
import {
  showApiErrorToast,
  showApiSuccessToast,
} from "@/lib/api-toast";

export function useMembershipCheckout() {
  const queryClient = useQueryClient();
  const { children } = useActivePlayer();
  const { mutate: startCheckout, isPending } = useMembershipCheckoutMutation();

  /**
   * Starts PayPal checkout — or, with an organization's code that covers the
   * whole bill, activates the memberships on the spot and goes to the
   * player selection or dashboard, because there is nothing left to pay.
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
        onSuccess: async (response) => {
          if (response.requiresPayment === false) {
            ["authUser", "children"].forEach((key) =>
              queryClient.removeQueries({ queryKey: [key] }),
            );
            ["membership", "myTournaments", "tournaments", "notifications"].forEach(
              (key) => queryClient.invalidateQueries({ queryKey: [key] }),
            );

            showApiSuccessToast(response, "Membership activated");

            // Determine redirect destination based on player count
            const authData: any = queryClient.getQueryData(["authUser"]);
            const allChildren =
              children.length > 0
                ? children
                : authData?.data?.children || [];
            const playerCount = response.playerCount ?? allChildren.length;

            if (playerCount > 1 || allChildren.length > 1) {
              window.location.href = SELECT_PLAYER_ROUTE;
            } else if (allChildren.length === 1) {
              setActiveProfileId(allChildren[0]._id);
              window.location.href = DEFAULT_REDIRECT;
            } else {
              window.location.href = DEFAULT_REDIRECT;
            }
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
