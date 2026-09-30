/**
 * How many players one parent account may hold.
 *
 * Mirrors MAX_CHILDREN_PER_ACCOUNT on the server, which is the real boundary —
 * this copy exists so the UI can stop a parent before they fill in a form that
 * is going to be refused, and so the wording and the number cannot drift apart.
 *
 * Every profile counts, whatever its state: a deactivated player still occupies
 * a slot. Players added but not yet paid for count while they exist, and give
 * the slot back when an abandoned checkout discards them.
 */
export const MAX_PLAYERS_PER_ACCOUNT = 4;

/** The one sentence shown wherever adding is blocked, so it reads the same everywhere. */
export const PLAYER_LIMIT_MESSAGE = `You have reached the maximum of ${MAX_PLAYERS_PER_ACCOUNT} players on one account.`;
