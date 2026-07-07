"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LogoutConfirmModal from "@/features/dashboard/components/logout-confirm-modal";
import { useAuth } from "@/hooks/use-auth";
import {
  MY_PROFILE_ROUTE,
  SETTINGS_ROUTE,
} from "@/config/routes";
import { cn } from "@/utils/cn";

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="5" r="3.5" fill="white" />
      <path d="M3 16C3 12.5 5.5 10.5 9 10.5C12.5 10.5 15 12.5 15 16" fill="white" />
    </svg>
  );
}

function ProfileMenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="5.5" r="3" stroke="#083F92" strokeWidth="1.5" />
      <path
        d="M3.5 15.5C3.5 12.5 5.8 10.5 9 10.5C12.2 10.5 14.5 12.5 14.5 15.5"
        stroke="#083F92"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsMenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="2.25" stroke="#083F92" strokeWidth="1.5" />
      <path
        d="M9 2.5V4.25M9 13.75V15.5M15.5 9H13.75M4.25 9H2.5M13.364 4.636L12.121 5.879M5.879 12.121L4.636 13.364M13.364 13.364L12.121 12.121M5.879 5.879L4.636 4.636"
        stroke="#083F92"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutMenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M6.5 9H14M14 9L11.5 6.5M14 9L11.5 11.5"
        stroke="#083F92"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 4.5H5.5C4.67157 4.5 4 5.17157 4 6V12C4 12.8284 4.67157 13.5 5.5 13.5H9"
        stroke="#083F92"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "WSCF Member";
  const email = user?.email ?? "member@wscf.org";
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
        <UserIcon />
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
                <UserIcon />
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
              icon={<ProfileMenuIcon />}
              onNavigate={closeMenu}
            />
            <ProfileMenuItem
              href={SETTINGS_ROUTE}
              label="Settings"
              icon={<SettingsMenuIcon />}
              onNavigate={closeMenu}
            />
            <ProfileMenuItem
              label="Log Out"
              icon={<LogoutMenuIcon />}
              onClick={handleLogout}
            />
          </div>
        </div>
      ) : null}
    </div>

      {isLogoutOpen ? (
        <LogoutConfirmModal onClose={() => setIsLogoutOpen(false)} onConfirm={confirmLogout} />
      ) : null}
    </>
  );
}
