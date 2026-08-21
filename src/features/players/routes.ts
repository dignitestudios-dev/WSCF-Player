/**
 * Where the player-selection flow lives.
 *
 * Kept apart from /membership/select-profile, which is a different thing
 * entirely: that one claims a record from the master players file, this one
 * picks which of your children the app is showing.
 */
export const SELECT_PLAYER_ROUTE = "/players/select";
export const ADD_PLAYER_ROUTE = "/players/add";
export const CLAIM_RATINGS_ROUTE = "/players/claim-ratings";
