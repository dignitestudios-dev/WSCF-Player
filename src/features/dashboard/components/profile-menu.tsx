"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LogoutConfirmModal from "@/features/dashboard/components/logout-confirm-modal";
import SwitchPlayerDialog from "@/features/players/components/switch-player-dialog";
import { useActivePlayer } from "@/features/players/use-active-player";
import { useAuth } from "@/hooks/use-auth";
import {
  ADD_PLAYER_ROUTE,
  MY_PROFILE_ROUTE,
  SETTINGS_ROUTE,
} from "@/config/routes";
import { cn } from "@/utils/cn";
import { User, CircleUser, Settings, LogOut, Users, UserPlus } from "lucide-react";



interface ProfileMenuItemProps {
  href?: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  onNavigate?: () => void;
}

function ProfileMenuItem({
  href,
  label,
  icon,
  onClick,
  onNavigate,
}: ProfileMenuItemProps) {
  const className =
    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-[#121111] transition-colors hover:bg-[rgba(8,63,146,0.08)]";

  if (href) {
    return (
      <Link href={href} className={className} onClick={onNavigate} role="menuitem">
        {icon}
        {label}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick} role="menuitem">
      {icon}
      {label}
    </button>
  );
}

export default function ProfileMenu() {
  const { logout } = useAuth();
  const { account, activePlayer, hasMultiplePlayers } = useActivePlayer();
  const [open, setOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isSwitchOpen, setIsSwitchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // The app is showing a player, so the menu names that player. The account
  // email underneath is the parent's — that is who signed in.
  const displayName =
    activePlayer?.name?.trim() || account?.name || "WSCF Member";
  const email = account?.email ?? "member@wscf.org";
  const profileHref = MY_PROFILE_ROUTE;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  function handleLogout() {
    closeMenu();
    setIsLogoutOpen(true);
  }

  function confirmLogout() {
    setIsLogoutOpen(false);
    logout();
  }

  return (
    <>
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#083F92] shadow-[0px_4px_8px_rgba(6,62,145,0.25)] transition-opacity",
          open && "opacity-90"
        )}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <User className="h-[18px] w-[18px] text-white" />
      </button>

      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+10px)] z-[60] w-[280px] overflow-hidden rounded-2xl border border-[#DADADA] bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.12)]"
          role="menu"
          aria-label="Profile menu"
        >
          <div className="border-b border-[#F4F4F4] px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#083F92]">
                <User className="h-[18px] w-[18px] text-white" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#121111]">{displayName}</p>
                <p className="truncate text-xs font-medium text-[#636363]">{email}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 p-2">
            <ProfileMenuItem
              href={profileHref}
              label="My Profile"
              icon={<CircleUser className="h-[18px] w-[18px] text-[#083F92]" />}
              onNavigate={closeMenu}
            />
            {/* With more than one player there is somewhere to switch to, and
                the switch dialog is also where another is added. With only one
                there is nothing to switch between, so the menu offers the one
                thing that is actually useful: adding another. */}
            {hasMultiplePlayers ? (
              <ProfileMenuItem
                label="Switch Profile"
                icon={<Users className="h-[18px] w-[18px] text-[#083F92]" />}
                onClick={() => {
                  closeMenu();
                  setIsSwitchOpen(true);
                }}
              />
            ) : (
              <ProfileMenuItem
                href={ADD_PLAYER_ROUTE}
                label="Add Player"
                icon={<UserPlus className="h-[18px] w-[18px] text-[#083F92]" />}
                onNavigate={closeMenu}
              />
            )}
            <ProfileMenuItem
              href={SETTINGS_ROUTE}
              label="Settings"
              icon={<Settings className="h-[18px] w-[18px] text-[#083F92]" />}
              onNavigate={closeMenu}
            />
            <ProfileMenuItem
              label="Log Out"
              icon={<LogOut className="h-[18px] w-[18px] text-[#083F92]" />}
              onClick={handleLogout}
            />
          </div>
        </div>
      ) : null}
    </div>

      <SwitchPlayerDialog
        open={isSwitchOpen}
        onClose={() => setIsSwitchOpen(false)}
      />

      {isLogoutOpen ? (
        <LogoutConfirmModal onClose={() => setIsLogoutOpen(false)} onConfirm={confirmLogout} />
      ) : null}
    </>
  );
}
