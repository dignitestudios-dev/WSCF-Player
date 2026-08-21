import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  clearAllNotifications,
  deleteNotification,
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/features/notifications/api/notifications.service";
import { showApiErrorToast } from "@/lib/api-toast";

const PAGE_SIZE = 15;

/** Both the feed and the badge hang off these, so one invalidate refreshes both. */
export const notificationKeys = {
  feed: ["notifications", "feed"] as const,
  unread: ["notifications", "unread-count"] as const,
};

/**
 * The dropdown's feed. Pages are appended as the player scrolls, and the query
 * stops asking once the last page is reached.
 *
 * Only fetched while the dropdown is open.
 */
export function useNotificationsFeedQuery(enabled: boolean) {
  return useInfiniteQuery({
    queryKey: notificationKeys.feed,
    queryFn: ({ pageParam }) => getNotifications(pageParam, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage: NotificationsApiResponse) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled,
  });
}

/**
 * The badge count.
 *
 * Deliberately not realtime and not polled: it is read once when the app loads,
 * and again after anything that could change it (marking read, clearing, or
 * opening the feed). A player sees new notifications on their next page load,
 * which is all this needs to do.
 */
export function useUnreadCountQuery() {
  return useQuery({
    queryKey: notificationKeys.unread,
    queryFn: getUnreadCount,
  });
}

function useNotificationMutation<TArgs>(
  mutationFn: (args: TArgs) => Promise<unknown>,
  fallbackError: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.feed });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread });
    },
    // The row visibly changes on success, so only failures are worth a toast.
    onError: (error) => showApiErrorToast(error, fallbackError),
  });
}

export function useMarkNotificationReadMutation() {
  return useNotificationMutation<string>(
    markNotificationRead,
    "Could not mark that notification as read.",
  );
}

export function useMarkAllNotificationsReadMutation() {
  return useNotificationMutation<void>(
    markAllNotificationsRead,
    "Could not mark your notifications as read.",
  );
}

export function useDeleteNotificationMutation() {
  return useNotificationMutation<string>(
    deleteNotification,
    "Could not remove that notification.",
  );
}

export function useClearAllNotificationsMutation() {
  return useNotificationMutation<void>(
    clearAllNotifications,
    "Could not clear your notifications.",
  );
}
