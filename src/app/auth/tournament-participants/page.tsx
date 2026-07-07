import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import TournamentParticipants from "@/features/tournaments/components/tournament-participants";

export const metadata: Metadata = createPageMetadata("tournamentParticipants");

export default function TournamentParticipantsPage() {
  return <TournamentParticipants />;
}
