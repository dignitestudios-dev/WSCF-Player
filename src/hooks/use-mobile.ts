import * as React from "react"

/** Below this width the app presents itself as a phone app. Matches Tailwind's `md`. */
const MOBILE_BREAKPOINT = 768

const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

/**
 * True on a phone-sized screen. Reads the media query directly (not the window
 * width) so it flips exactly where the Tailwind `md:` classes do, and the server
 * renders the desktop version, which the client corrects on hydration.
 */
export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  )
}
