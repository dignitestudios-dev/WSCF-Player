import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import { getTournamentById } from "@/features/tournaments/data/tournaments";
import TournamentRegisteredPlayers from "@/features/tournaments/components/tournament-registered-players";

interface TournamentRegisteredPlayersPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: TournamentRegisteredPlayersPageProps): Promise<Metadata> {
  const { id } = await params;
  const tournament = getTournamentById(id);
  const base = createPageMetadata("registeredPlayers");

  if (!tournament) return base;

  return {
    ...base,
    title: `Registered Players | ${tournament.title}`,
    description: `Browse all ${tournament.registeredCount} registered players for ${tournament.title} with the Wisconsin Scholastic Chess Federation.`,
  };
}

export default async function TournamentRegisteredPlayersPage({
  params,
}: TournamentRegisteredPlayersPageProps) {
  const { id } = await params;

  return <TournamentRegisteredPlayers tournamentId={id} />;
}
