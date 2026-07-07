"use client";

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
  const { mutate: startCheckout, isPending } = useMembershipCheckoutMutation();

  function handleProceedToPayment() {
    const origin = window.location.origin;

    startCheckout(
      {
        successUrl: `${origin}${MEMBERSHIP_SUCCESS_ROUTE}`,
        cancelUrl: `${origin}${MEMBERSHIP_CANCEL_ROUTE}`,
      },
      {
        onSuccess: (response) => {
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
