/**
 * What the Division and Team columns show for a registered player.
 *
 * Shared by the tournament details table and its "View All" list so the two can
 * never disagree. The API sends `team: null` for a player on no team, and a
 * division whose name the admin may have left empty — so neither is assumed.
 */

const EMPTY = "—";

type ParticipantDivision = TournamentParticipantApiData["division"];
type ParticipantTeam = TournamentParticipantApiData["team"];

/**
 * The admin-typed name when there is one, otherwise the grade/rating rule
 * ("Grades K–3 · Rating under 600"), so the cell is never blank for a player
 * who is in a division. `hint` carries the rule for a tooltip when the name is
 * what is shown, because a name like "Section B" says nothing about who it is
 * for.
 */
export function getDivisionCell(division: ParticipantDivision) {
  const label = division?.label?.trim() || division?.criteria?.trim() || EMPTY;
  const hint =
    division?.label && division.criteria ? division.criteria : undefined;

  return { label, hint };
}

export function getTeamCell(team: ParticipantTeam) {
  return team?.name?.trim() || EMPTY;
}
