import { redirect } from "next/navigation";
import { REGISTERED_TOURNAMENTS_ROUTE } from "@/config/routes";

// See the success route: kept only so an in-flight checkout session created
// before the redirect target changed still lands somewhere sensible.
export default function PaymentCancelPage() {
  redirect(`${REGISTERED_TOURNAMENTS_ROUTE}?payment=cancelled`);
}
