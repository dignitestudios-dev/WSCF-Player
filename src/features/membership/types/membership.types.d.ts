interface MembershipCheckoutPayload {
  successUrl: string;
  cancelUrl: string;
  /** An organization's code. When it covers the bill, nothing goes to PayPal. */
  couponCode?: string;
}

interface MembershipCheckoutResponse {
  url?: string;
  checkoutUrl?: string;
  sessionUrl?: string;
  /** False when a coupon covered everything: there is no checkout to open. */
  requiresPayment?: boolean;
  apiMessage?: string;
}
