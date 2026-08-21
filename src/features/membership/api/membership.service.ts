import axiosInstance from "@/lib/axios";

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

  const checkoutUrl = getCheckoutUrl(data);

  if (!checkoutUrl) {
    throw new Error(data.message ?? "Invalid checkout response");
  }

  return {
    url: checkoutUrl,
    apiMessage: data.message,
  };
}

export interface MembershipQuote {
  unitPrice: number;
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
