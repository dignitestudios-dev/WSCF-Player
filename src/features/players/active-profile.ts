"use client";

/**
 * Which child the parent is currently acting as.
 *
 * The account belongs to the parent, but the whole app — dashboard, history,
 * notifications, tournament entries — is scoped to one child at a time. That
 * choice is made here, kept in localStorage so it survives a reload, and sent
 * to the API on every request as `x-player-profile`.
 *
 * A cookie mirror exists purely so the route middleware can tell, before any
 * JavaScript runs, whether a child has been chosen yet.
 */

export const ACTIVE_PROFILE_KEY = "wscf-active-player";

/** Broadcast on change so open screens re-read it without a reload. */
export const ACTIVE_PROFILE_EVENT = "wscf:active-player-changed";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function getActiveProfileId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_PROFILE_KEY);
}

export function setActiveProfileId(id: string) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  document.cookie = `${ACTIVE_PROFILE_KEY}=${id}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}`;
  window.dispatchEvent(new CustomEvent(ACTIVE_PROFILE_EVENT, { detail: id }));
}

export function clearActiveProfileId() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(ACTIVE_PROFILE_KEY);
  document.cookie = `${ACTIVE_PROFILE_KEY}=; path=/; max-age=0`;
  window.dispatchEvent(new CustomEvent(ACTIVE_PROFILE_EVENT, { detail: null }));
}
