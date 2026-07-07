import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import RegisteredTournaments from "@/features/dashboard/components/registered-tournaments";

export const metadata: Metadata = createPageMetadata("registeredTournaments");

export default function RegisteredTournamentsPage() {
  return <RegisteredTournaments />;
}
