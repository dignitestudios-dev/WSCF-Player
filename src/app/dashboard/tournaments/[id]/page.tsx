import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import { getTournamentById } from "@/features/tournaments/data/tournaments";
import TournamentDetails from "@/features/tournaments/components/tournament-details";

interface TournamentDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TournamentDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const tournament = getTournamentById(id);
  const base = createPageMetadata("tournamentDetails");

  if (!tournament) return base;

  return {
    ...base,
    title: tournament.title,
    description: `View tournament details and registered players for ${tournament.title} with the Wisconsin Scholastic Chess Federation.`,
  };
}

export default async function TournamentDetailsPage({ params }: TournamentDetailsPageProps) {
  const { id } = await params;

  return <TournamentDetails tournamentId={id} />;
}
