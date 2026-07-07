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
