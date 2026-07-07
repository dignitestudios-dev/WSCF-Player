"use client";

const notifications: DashboardNotification[] = [
  {
    id: "1",
    title: "Tournament Reminder",
    time: "2h",
    message:
      "Spring Blitz Arena starts tomorrow at 9:00 AM. Please arrive 30 minutes early for player check-in and board setup.",
    icon: "tournament",
  },
  {
    id: "2",
    title: "Team Assignment",
    time: "5h",
    message:
      "Your team assignment for Clash Championship has been updated. View your profile for the latest details.",
    icon: "alert",
  },
  {
    id: "3",
    title: "Rating Updated",
    time: "1d",
    message:
      "Congratulations! Your USCF rating increased by 32 points after the latest tournament results.",
    icon: "rating",
  },
];

export function useNotifications() {
  return { notifications };
}
