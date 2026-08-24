export const APP_NAME = "Dexnive";
export const AUTH_TOKEN_KEY = "auth-token";
export const AUTH_USER_KEY = "auth-user";
/**
 * How long the auth cookie lives.
 *
 * Matched to the API's token lifetime (7 days). The route guard authorises
 * from this cookie while requests authorise from the token in localStorage —
 * so a cookie that expires first does not end the session, it just starts
 * bouncing every protected page to the login screen while the session is still
 * perfectly valid. The two must expire together.
 */
export const TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
