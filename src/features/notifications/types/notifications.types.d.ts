type NotificationType =
  | "tournament.registered"
  | "tournament.rescheduled"
  | "membership.renewed"
  | "membership.expired"
  | "membership.payment_failed"
  | "team.member_added"
  | "result.uploaded"
  | "custom";

/**
 * One notification as this player sees it. The same document can be addressed
 * to many people, so `isRead` is the caller's own state, resolved server-side.
 */
interface NotificationItem {
  _id: string;
  type: NotificationType;
  audience: "player" | "admin";
  title: string;
  body: string;
  data?: {
    entity?: string;
    entityId?: string | null;
    [key: string]: unknown;
  };
  isRead: boolean;
  createdAt: string;
}

interface NotificationsPagination {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

interface NotificationsApiResponse {
  success: boolean;
  message: string;
  data: {
    notifications: NotificationItem[];
    unreadCount: number;
  };
  pagination: NotificationsPagination;
}

interface UnreadCountApiResponse {
  success: boolean;
  message: string;
  data: { unreadCount: number };
}
