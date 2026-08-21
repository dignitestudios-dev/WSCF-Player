import axiosInstance from "@/lib/axios";

export async function getNotifications(
  page: number,
  limit: number,
): Promise<NotificationsApiResponse> {
  const { data } = await axiosInstance.get<NotificationsApiResponse>(
    "/notification",
    { params: { page, limit } },
  );

  return data;
}

export async function getUnreadCount(): Promise<UnreadCountApiResponse> {
  const { data } = await axiosInstance.get<UnreadCountApiResponse>(
    "/notification/unread-count",
  );

  return data;
}

export async function markNotificationRead(notificationId: string) {
  const { data } = await axiosInstance.patch(
    `/notification/${notificationId}/read`,
  );

  return data;
}

export async function markAllNotificationsRead() {
  const { data } = await axiosInstance.patch("/notification/read-all");

  return data;
}

/** Hides it for this player only — everyone else on it keeps their copy. */
export async function deleteNotification(notificationId: string) {
  const { data } = await axiosInstance.delete(`/notification/${notificationId}`);

  return data;
}

export async function clearAllNotifications() {
  const { data } = await axiosInstance.delete("/notification/clear-all");

  return data;
}
