"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  CircleUser,
  House,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DASHBOARD_PLAYERS_RATING_ROUTE,
  DASHBOARD_TOURNAMENTS_ROUTE,
  DEFAULT_REDIRECT,
  MY_PROFILE_ROUTE,
  REGISTERED_TOURNAMENTS_ROUTE,
} from "@/config/routes";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Paths that should light this tab up, beyond its own href. */
  match: (pathname: string) => boolean;
}

const startsWith = (prefix: string) => (pathname: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

// Five tabs, the most a thumb can hit reliably. Everything else (settings,
// switching player, history, log out) is behind the avatar in the top bar.
const ITEMS: NavItem[] = [
  {
    href: DEFAULT_REDIRECT,
    label: "Home",
    icon: House,
    // "/dashboard" is a prefix of every page here, so Home matches only itself.
    match: (pathname) => pathname === DEFAULT_REDIRECT,
  },
  {
    href: DASHBOARD_TOURNAMENTS_ROUTE,
    label: "Tournaments",
    icon: Trophy,
    match: startsWith(DASHBOARD_TOURNAMENTS_ROUTE),
  },
  {
    href: REGISTERED_TOURNAMENTS_ROUTE,
    label: "Registered",
    icon: CalendarCheck,
    match: startsWith(REGISTERED_TOURNAMENTS_ROUTE),
  },
  {
    href: DASHBOARD_PLAYERS_RATING_ROUTE,
    label: "Players",
    icon: Users,
    // A player's profile is reached from this list, so it belongs to this tab.
    match: (pathname) =>
      startsWith(DASHBOARD_PLAYERS_RATING_ROUTE)(pathname) ||
      startsWith("/dashboard/player-profile")(pathname),
  },
  {
    href: MY_PROFILE_ROUTE,
    label: "Profile",
    icon: CircleUser,
    match: (pathname) =>
      startsWith(MY_PROFILE_ROUTE)(pathname) ||
      startsWith("/dashboard/my-history")(pathname),
  },
];

/**
 * The phone's navigation bar. Hidden from `md` up, where the top header and the
 * page's own links do the job.
 *
 * Pads itself by the home-bar inset so the labels are never under it, and sits
 * below the sheets (z-40 against their z-50) so a drawer covers it.
 */
export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E4E4EC] bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(8,63,146,0.06)] backdrop-blur supports-[backdrop-filter]:bg-white/85 md:hidden"
    >
      <ul className="mx-auto grid max-w-[560px] grid-cols-5">
        {ITEMS.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium leading-none transition-colors active:bg-[#083F92]/5",
                  active ? "text-[#083F92]" : "text-[#6B6B76]"
                )}
              >
                {/* The pill behind the icon is the "you are here" mark; the
                    label colour alone is too faint to rely on in daylight. */}
                <span
                  className={cn(
                    "flex h-7 w-14 items-center justify-center rounded-full transition-colors",
                    active ? "bg-[#083F92]/10" : "group-active:bg-[#083F92]/5"
                  )}
                >
                  <Icon
                    className="h-[22px] w-[22px]"
                    strokeWidth={active ? 2.4 : 1.9}
                    aria-hidden
                  />
                </span>
                <span className={cn(active && "font-semibold")}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
