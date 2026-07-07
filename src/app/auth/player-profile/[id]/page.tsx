import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import PlayerProfile from "@/features/players/components/player-profile";

export const metadata: Metadata = createPageMetadata("playerProfile");

export default function PlayerProfilePage() {
  return <PlayerProfile />;
}
