import { redirect } from "next/navigation";
import { MEMBERSHIP_PAYMENT_ROUTE } from "@/config/routes";

/**
 * This page used to be called Membership Validation and lived here. It is the
 * membership payment page now; the old address stays so a bookmark or an old
 * link still lands in the right place.
 */
export default function LegacyMembershipValidationPage() {
  redirect(MEMBERSHIP_PAYMENT_ROUTE);
}
