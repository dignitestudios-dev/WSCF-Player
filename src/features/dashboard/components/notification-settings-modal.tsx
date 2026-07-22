"use client";

import { useNotificationSettings } from "@/features/dashboard/hooks/use-notification-settings";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface NotificationSettingsModalProps {
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ToggleSwitch({
  enabled,
  onToggle,
  label,
}: {
  enabled: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={`Toggle ${label}`}
      onClick={onToggle}
      className={`relative h-6 w-[42px] shrink-0 rounded-full transition-colors ${
        enabled ? "bg-[#083F92]" : "bg-[#DADADA]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0px_3px_8px_rgba(0,0,0,0.15),0px_3px_1px_rgba(0,0,0,0.06)] transition-all ${
          enabled ? "left-[20px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function NotificationSettingRow({
  setting,
  onToggle,
}: {
  setting: NotificationSetting;
  onToggle: () => void;
}) {
  return (
    <div className="flex h-12 items-center justify-between rounded-[2px] bg-[#F9FAFA] px-4">
      <span className="text-base font-medium leading-[22px] text-[#181818]">{setting.label}</span>
      <ToggleSwitch enabled={setting.enabled} onToggle={onToggle} label={setting.label} />
    </div>
  );
}

export default function NotificationSettingsModal({ onClose }: NotificationSettingsModalProps) {
  const { settings, toggleSetting } = useNotificationSettings();

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent 
        showCloseButton={false}
        className="w-full max-w-[761px] rounded-[12px] px-[60px] pb-[60px] pt-[60px] border-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] !outline-none"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%), #FFFFFF",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center text-[#181818]"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <h2
          id="notification-settings-title"
          className="mb-[30px] text-center text-[32px] font-bold capitalize leading-[43px] tracking-[-0.018em] text-[#181818]"
        >
          Notification Settings
        </h2>

        <div className="flex flex-col gap-3">
          {settings.map((setting) => (
            <NotificationSettingRow
              key={setting.id}
              setting={setting}
              onToggle={() => toggleSetting(setting.id)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
