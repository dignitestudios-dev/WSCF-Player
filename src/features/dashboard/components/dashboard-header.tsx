"use client";

import Image from "next/image";
import Link from "next/link";
import ProfileMenu from "@/features/dashboard/components/profile-menu";
import NotificationsMenu from "@/features/notifications/components/notifications-menu";
import { useActivePlayer } from "@/features/players/use-active-player";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardHeader() {
  const { user } = useAuth();
  const { account, isLoading } = useActivePlayer();

  const primaryParent =
    user?.parents?.father?.isPrimary ? user.parents.father :
    user?.parents?.mother?.isPrimary ? user.parents.mother :
    account?.parents?.father?.isPrimary ? account.parents.father :
    account?.parents?.mother?.isPrimary ? account.parents.mother :
    null;

  const parentName =
    primaryParent?.name?.trim() ||
    user?.name?.trim() ||
    account?.name?.trim() ||
    "";

  return (
    // Padded by the notch inset so that when the app is installed (no browser
    // bar) the status bar never sits on top of the logo.
    <header className="sticky top-0 z-40 border-b border-[#DADADA] bg-white pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between gap-4 px-4 md:h-[104px] md:px-6 lg:px-0">
        <Link
          href="/dashboard"
          aria-label="WSCF home"
          className="relative h-10 w-[96px] shrink-0 md:h-[68px] md:w-[134px]"
        >
          <Image
            src="/images/logo.png"
            alt="WSCF - Wisconsin Scholastic Chess Federation"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        {isLoading && !parentName ? (
          <div className="hidden h-5 w-40 animate-pulse rounded-full bg-[#EFEFEF] sm:block" />
        ) : parentName ? (
          <div className="hidden min-w-0 flex-1 flex-col sm:flex">
            <span className="text-xs leading-4 text-[#787878]">
              Signed in as
            </span>
            <span className="truncate text-base font-semibold leading-[22px] text-[#083F92]">
              {parentName}
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
