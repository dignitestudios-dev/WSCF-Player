import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import Tournaments from "@/features/dashboard/components/tournaments";

export const metadata: Metadata = createPageMetadata("tournaments");

export default function TournamentsPage() {
  return <Tournaments />;
}
