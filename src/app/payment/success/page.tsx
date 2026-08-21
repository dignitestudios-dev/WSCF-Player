import { redirect } from "next/navigation";
import { REGISTERED_TOURNAMENTS_ROUTE } from "@/config/routes";

// Tournament payments now return straight to the registered tournaments list,
// which shows the outcome as a dialog. This route only exists so a checkout
// session created before that change still lands somewhere sensible.
export default function PaymentSuccessPage() {
  redirect(`${REGISTERED_TOURNAMENTS_ROUTE}?payment=success`);
}
