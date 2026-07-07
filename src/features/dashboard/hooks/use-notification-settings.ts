"use client";

import { useState } from "react";

const defaultSettings: NotificationSetting[] = [
  { id: "tournament-reminder", label: "Tournament Reminder", enabled: true },
  { id: "team-assignment", label: "Team Assignment", enabled: true },
  { id: "rating-updated", label: "Rating Updated", enabled: true },
  { id: "membership-alert", label: "Membership Alert", enabled: true },
  { id: "event-updates", label: "Event Updates", enabled: true },
];

export function useNotificationSettings() {
  const [settings, setSettings] = useState(defaultSettings);

  function toggleSetting(id: string) {
    setSettings((current) =>
      current.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  }

  return {
    settings,
    toggleSetting,
  };
}
