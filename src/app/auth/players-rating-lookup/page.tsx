import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import PlayersRatingLookup from "@/features/auth/components/players-rating-lookup";

export const metadata: Metadata = createPageMetadata("playersRatingLookup");

export default function PlayersRatingLookupPage() {
  return <PlayersRatingLookup />;
}
