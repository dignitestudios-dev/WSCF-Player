"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAuthUserQuery } from "@/features/auth/api/auth.queries";

const baseSettingsItems = [
  { id: "renew-membership", label: "Renew Membership", action: "renew-membership" },
  { id: "change-password", label: "Change Password", action: "change-password" },
  { id: "notification", label: "Notification", action: "notification" },
  { id: "terms", label: "Terms & Conditions", action: "terms" },
  { id: "privacy", label: "Privacy Policy", action: "privacy" },
  { id: "logout", label: "Logout", action: "logout", danger: true },
];

export function useSettings() {
  const { logout } = useAuth();
  const [activePolicy, setActivePolicy] = useState<PolicyModalType | null>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isRenewMembershipOpen, setIsRenewMembershipOpen] = useState(false);
  const { data: authData } = useAuthUserQuery();

  const isMembershipActive = authData?.data?.membership?.status === "active";
  const settingsItems = baseSettingsItems.filter(item => 
    item.id === "renew-membership" ? !isMembershipActive : true
  ) as SettingsItem[];

  function openPolicy(type: PolicyModalType) {
    setActivePolicy(type);
  }

  function closePolicy() {
    setActivePolicy(null);
  }

  function openChangePassword() {
    setIsChangePasswordOpen(true);
  }

  function closeChangePassword() {
    setIsChangePasswordOpen(false);
  }

  function openNotificationSettings() {
    setIsNotificationSettingsOpen(true);
  }

  function closeNotificationSettings() {
    setIsNotificationSettingsOpen(false);
  }

  function openLogout() {
    setIsLogoutOpen(true);
  }

  function closeLogout() {
    setIsLogoutOpen(false);
  }

  function confirmLogout() {
    setIsLogoutOpen(false);
    logout();
  }

  function openRenewMembership() {
    setIsRenewMembershipOpen(true);
  }

  function closeRenewMembership() {
    setIsRenewMembershipOpen(false);
  }

  return {
    items: settingsItems,
    activePolicy,
    openPolicy,
    closePolicy,
    isChangePasswordOpen,
    openChangePassword,
    closeChangePassword,
    isNotificationSettingsOpen,
    openNotificationSettings,
    closeNotificationSettings,
    isLogoutOpen,
    openLogout,
    closeLogout,
    confirmLogout,
    isRenewMembershipOpen,
    openRenewMembership,
    closeRenewMembership,
  };
}
