import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createMembershipCheckout,
  getMembershipQuote,
} from "@/features/membership/api/membership.service";

export function useMembershipCheckoutMutation() {
  return useMutation({
    mutationFn: (payload: MembershipCheckoutPayload) =>
      createMembershipCheckout(payload),
  });
}

/**
 * What the account owes. `enabled` lets a caller hold it back until something
 * that changes the answer has settled — the cancel screen discards abandoned
 * players before asking for the total.
 */
export function useMembershipQuoteQuery({ enabled = true } = {}) {
  return useQuery({
    queryKey: ["membership", "quote"],
    queryFn: getMembershipQuote,
    enabled,
  });
}
