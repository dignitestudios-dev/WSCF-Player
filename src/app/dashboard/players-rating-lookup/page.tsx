import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import DashboardPlayersRatingLookup from "@/features/dashboard/components/dashboard-players-rating-lookup";

export const metadata: Metadata = createPageMetadata("playersRatingLookup");

export default function DashboardPlayersRatingLookupPage() {
  return <DashboardPlayersRatingLookup />;
}
