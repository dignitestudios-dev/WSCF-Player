import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_REDIRECT,
  DEFAULT_REDIRECT,
  PROTECTED_ROUTES,
} from "@/config/routes";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // Verifying an email and the screen confirming it are onboarding steps, not
  // sign-in pages: you are already authenticated by then and still need to see
  // them, so they are deliberately absent from the list below — bouncing a
  // signed-in user away from those two would break signup.
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthPage =
    [
      "/auth/login",
      "/auth/member-login",
      "/auth/forgot-password",
      "/auth/players-rating-lookup",
      "/auth/set-new-password",
      "/auth/register",
      "/auth/tournament-participants",
    ].includes(pathname) || pathname.startsWith("/auth/player-profile/");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL(AUTH_REDIRECT, request.url));
  }
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
