import { useMutation } from "@tanstack/react-query";
import { createMembershipCheckout } from "@/features/membership/api/membership.service";

export function useMembershipCheckoutMutation() {
  return useMutation({
    mutationFn: (payload: MembershipCheckoutPayload) =>
      createMembershipCheckout(payload),
  });
}
