/**
 * A safety ceiling on players per parent account, not a product limit: no real
 * family comes near it, and nothing in the UI mentions it.
 *
 * Mirrors MAX_CHILDREN_PER_ACCOUNT on the server, which is the real boundary.
 * Every profile counts, whatever its state.
 */
export const MAX_PLAYERS_PER_ACCOUNT = 100;
