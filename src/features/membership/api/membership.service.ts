import axiosInstance from "@/lib/axios";
import type { AppliedCoupon } from "@/features/tournaments/api/coupons.service";

interface MembershipCheckoutApiResponse {
  success?: boolean;
  message?: string;
  url?: string;
  checkoutUrl?: string;
  sessionUrl?: string;
  data?: {
    url?: string;
    checkoutUrl?: string;
    sessionUrl?: string;
    requiresPayment?: boolean;
  };
}

function getCheckoutUrl(data: MembershipCheckoutApiResponse): string | null {
  return (
    data.url ??
    data.checkoutUrl ??
    data.sessionUrl ??
    data.data?.url ??
    data.data?.checkoutUrl ??
    data.data?.sessionUrl ??
    null
  );
}

export async function createMembershipCheckout(
  payload: MembershipCheckoutPayload
): Promise<MembershipCheckoutResponse> {
  const { data } = await axiosInstance.post<MembershipCheckoutApiResponse>(
    "/membership/checkout",
    payload
  );

  if (data.success === false) {
    throw new Error(data.message ?? "Failed to start checkout");
  }

  // An organization's code covered the bill: the memberships are already
  // active, so there is no PayPal page to go to.
  if (data.data?.requiresPayment === false) {
    return { requiresPayment: false, apiMessage: data.message };
  }

  const checkoutUrl = getCheckoutUrl(data);

  if (!checkoutUrl) {
    throw new Error(data.message ?? "Invalid checkout response");
  }

  return {
    url: checkoutUrl,
    requiresPayment: true,
    apiMessage: data.message,
  };
}

export interface MembershipQuote {
  unitPrice: number;
  /** What a membership bought now is valid until, e.g. "August 31, 2027". */
  validUntilLabel?: string;
  playerCount: number;
  totalAmount: number;
  players: { _id: string; name: string }[];
}

/**
 * What the account owes right now, itemised by player. Resolved server-side so
 * the price shown is the price charged.
 */
export async function getMembershipQuote(): Promise<MembershipQuote> {
  const { data } = await axiosInstance.get("/membership/quote");
  return data.data;
}

/**
 * Checks an organization's code against what the account owes, before anyone is
 * sent to PayPal. Returns the same shape the tournament coupon box uses, so one
 * box serves both: `entryFee` is the membership total here.
 */
export async function validateMembershipCoupon(
  code: string,
): Promise<AppliedCoupon> {
  const { data } = await axiosInstance.post("/membership/coupon/validate", {
    code,
  });
  const result = data.data;

  return {
    code: result.code,
    organizationName: result.organizationName,
    entryFee: result.amountDiscounted,
    amountDiscounted: result.amountDiscounted,
    payableAmount: result.payableAmount,
    coversFullFee: result.coversFullFee,
  };
}
