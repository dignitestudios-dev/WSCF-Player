"use client";

import Link from "next/link";
import ChangePasswordModal from "@/features/dashboard/components/change-password-modal";
import DeleteAccountFlow from "@/features/dashboard/components/delete-account-flow";
import LogoutConfirmModal from "@/features/dashboard/components/logout-confirm-modal";
import NotificationSettingsModal from "@/features/dashboard/components/notification-settings-modal";
import PolicyModal from "@/features/dashboard/components/policy-modal";
import { useSettings } from "@/features/dashboard/hooks/use-settings";

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke="#181818"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsRow({
  item,
  onOpenLogout,
  onOpenPolicy,
  onOpenChangePassword,
  onOpenNotificationSettings,
  onOpenDeleteAccount,
}: {
  item: SettingsItem;
  onOpenLogout: () => void;
  onOpenPolicy: (type: PolicyModalType) => void;
  onOpenChangePassword: () => void;
  onOpenNotificationSettings: () => void;
  onOpenDeleteAccount: () => void;
}) {
  const className =
    "flex h-[60px] w-full items-center justify-between rounded-[8px] bg-white px-4 py-[15px] text-lg font-medium capitalize leading-6 tracking-[-0.0041em] text-[#212935]";

  const labelClassName = item.danger ? "text-[#EE3131]" : "text-[#212935]";

  if (item.action === "logout") {
    return (
      <button type="button" onClick={onOpenLogout} className={className}>
        <span className={labelClassName}>{item.label}</span>
        <ArrowRightIcon />
      </button>
    );
  }

  if (item.action === "delete-account") {
    return (
      <button type="button" onClick={onOpenDeleteAccount} className={className}>
        <span className={labelClassName}>{item.label}</span>
        <ArrowRightIcon />
      </button>
    );
  }

  if (item.action === "change-password") {
    return (
      <button type="button" onClick={onOpenChangePassword} className={className}>
        <span className={labelClassName}>{item.label}</span>
        <ArrowRightIcon />
      </button>
    );
  }

  if (item.action === "notification") {
    return (
      <button type="button" onClick={onOpenNotificationSettings} className={className}>
        <span className={labelClassName}>{item.label}</span>
        <ArrowRightIcon />
      </button>
    );
  }

  if (item.action === "terms" || item.action === "privacy") {
    const policyType = item.action;

    return (
      <button type="button" onClick={() => onOpenPolicy(policyType)} className={className}>
        <span className={labelClassName}>{item.label}</span>
        <ArrowRightIcon />
      </button>
    );
  }

  if (item.href) {
    return (
      <Link href={item.href} className={className}>
        <span className={labelClassName}>{item.label}</span>
        <ArrowRightIcon />
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      <span className={labelClassName}>{item.label}</span>
      <ArrowRightIcon />
    </button>
  );
}

export default function Settings() {
  const {
    items,
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
    isDeleteAccountOpen,
    openDeleteAccount,
    closeDeleteAccount,
  } = useSettings();

  return (
    <>
      <div className="mx-auto max-w-[1240px] px-6 pb-12 pt-8 lg:px-0">
        <div className="mb-6 flex flex-col gap-3">
          <h1 className="text-[45px] font-bold leading-[61px] text-[#083F92]">Settings</h1>
          <p className="text-[22px] leading-[30px] text-[#151515]">View all settings</p>
        </div>

        <div className="flex max-w-[1237px] flex-col gap-[26px]">
          {items.map((item) => (
            <SettingsRow
              key={item.id}
              item={item}
              onOpenLogout={openLogout}
              onOpenDeleteAccount={openDeleteAccount}
              onOpenPolicy={openPolicy}
              onOpenChangePassword={openChangePassword}
              onOpenNotificationSettings={openNotificationSettings}
            />
          ))}
        </div>
      </div>

      {activePolicy ? <PolicyModal type={activePolicy} onClose={closePolicy} /> : null}
      {isChangePasswordOpen ? <ChangePasswordModal onClose={closeChangePassword} /> : null}
      {isNotificationSettingsOpen ? (
        <NotificationSettingsModal onClose={closeNotificationSettings} />
      ) : null}
      {isLogoutOpen ? (
        <LogoutConfirmModal onClose={closeLogout} onConfirm={confirmLogout} />
      ) : null}
      {isDeleteAccountOpen ? <DeleteAccountFlow onClose={closeDeleteAccount} /> : null}
    </>
  );
}
