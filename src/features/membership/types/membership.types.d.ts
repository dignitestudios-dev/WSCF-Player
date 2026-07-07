interface MembershipCheckoutPayload {
  successUrl: string;
  cancelUrl: string;
}

interface MembershipCheckoutResponse {
  url?: string;
  checkoutUrl?: string;
  sessionUrl?: string;
  apiMessage?: string;
}
