"use client";

import Image from "next/image";
import Link from "next/link";
import ProfileMenu from "@/features/dashboard/components/profile-menu";
import NotificationsMenu from "@/features/notifications/components/notifications-menu";
import { useActivePlayer } from "@/features/players/use-active-player";

export default function DashboardHeader() {
  // The dashboard is entirely about one child, and on an account with several
  // there is nothing else on screen saying which. Naming them here means the
  // parent can tell at a glance whose ratings and tournaments they are looking
  // at — the account holder's own name is in the profile menu.
  const { activePlayer, isLoading } = useActivePlayer();
  const playerName = activePlayer?.name?.trim();

  return (
    <header className="sticky top-0 z-50 border-b border-[#DADADA] bg-white">
      <div className="mx-auto flex h-[104px] max-w-[1240px] items-center justify-between gap-4 px-6 lg:px-0">
        <Link href="/dashboard" className="relative h-[68px] w-[134px] shrink-0">
          <Image
            src="/images/logo.png"
            alt="WSCF - Wisconsin Scholastic Chess Federation"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        {isLoading ? (
          <div className="hidden h-5 w-40 animate-pulse rounded-full bg-[#EFEFEF] sm:block" />
        ) : playerName ? (
          <div className="hidden min-w-0 flex-1 flex-col sm:flex">
            <span className="text-xs leading-4 text-[#787878]">
              Signed in as
            </span>
            <span className="truncate text-base font-semibold leading-[22px] text-[#083F92]">
              {playerName}
            </span>
          </div>
        ) : null}

        <div className="flex shrink-0 items-center gap-2.5">
          <NotificationsMenu />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
