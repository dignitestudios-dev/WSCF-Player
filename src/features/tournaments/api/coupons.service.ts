import axiosInstance from "@/lib/axios";

export interface AppliedCoupon {
  code: string;
  entryFee: number;
  amountDiscounted: number;
  payableAmount: number;
  /** True when the coupon takes the whole fee, so no payment is needed. */
  coversFullFee: boolean;
}

/**
 * Checks a coupon before the player commits, so the fee shown on the form is
 * the fee they will actually be charged.
 *
 * The server checks it again at registration — a code can be switched off,
 * expire or run out in between, and this result is never trusted later.
 */
export async function validateCoupon(payload: {
  code: string;
  tournamentId: string;
}): Promise<AppliedCoupon> {
  const { data } = await axiosInstance.post("/coupon/validate", payload);
  return data.data;
}
