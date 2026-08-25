"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  CalendarClock,
  CheckCheck,
  CreditCard,
  Loader2,
  Megaphone,
  Trash2,
  Trophy,
  Users,
  X,
} from "lucide-react";
import {
  useClearAllNotificationsMutation,
  useDeleteNotificationMutation,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsFeedQuery,
  useUnreadCountQuery,
} from "@/features/notifications/api/notifications.queries";
import { cn } from "@/utils/cn";

/** One icon per kind, so the feed can be scanned rather than read. */
const TYPE_ICONS: Record<NotificationType, typeof Bell> = {
  "tournament.registered": Trophy,
  "tournament.rescheduled": CalendarClock,
  "membership.renewed": CreditCard,
  "membership.expired": CreditCard,
  "membership.payment_failed": CreditCard,
  "team.member_added": Users,
  "result.uploaded": Trophy,
  custom: Megaphone,
};

/** "just now" / "3h ago" / "12 Sep" — absolute once it stops being recent. */
function relativeTime(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

interface NotificationRowProps {
  notification: NotificationItem;
  onRead: (id: string) => void;
  onRemove: (id: string) => void;
  isBusy: boolean;
  /** True while the row plays its exit; the delete follows. */
  isRemoving?: boolean;
}

/** Kept in step with the row's `duration-200` transition. */
const REMOVE_ANIMATION_MS = 200;

function NotificationRow({
  notification,
  onRead,
  onRemove,
  isBusy,
  isRemoving = false,
}: NotificationRowProps) {
  const Icon = TYPE_ICONS[notification.type] ?? Bell;

  return (
    <div
      className={cn(
        "group relative flex gap-3 border-b border-[#F4F4F4] px-4 py-4 last:border-b-0",
        // Collapsing the row rather than only fading it means the rows below
        // slide up to close the gap, instead of jumping.
        "origin-top overflow-hidden transition-all duration-200 ease-out",
        notification.isRead ? "bg-white" : "bg-[rgba(8,63,146,0.05)]",
        isRemoving
          ? "max-h-0 -translate-x-4 border-b-0 py-0 opacity-0"
          : "max-h-[200px] translate-x-0 opacity-100",
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          notification.isRead ? "bg-[#083F92]/40" : "bg-[#083F92]",
        )}
      >
        <Icon className="h-[18px] w-[18px] text-white" />
      </div>

      <div className="min-w-0 flex-1 pr-5">
        <div className="flex items-start gap-2">
          <p
            className={cn(
              "text-sm leading-5 text-[#121111]",
              notification.isRead ? "font-medium" : "font-semibold",
            )}
          >
            {notification.title}
          </p>
          {!notification.isRead ? (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#083F92]" />
          ) : null}
        </div>

        <p className="mt-1 text-xs font-medium leading-[18px] text-[#636363]">
          {notification.body}
        </p>

        <div className="mt-2 flex items-center gap-3">
          <span className="text-[11px] font-medium text-[#8C8C8C]">
            {relativeTime(notification.createdAt)}
          </span>

          {!notification.isRead ? (
            <button
              type="button"
              disabled={isBusy}
              onClick={() => onRead(notification._id)}
              className="text-[11px] font-semibold text-[#083F92] transition-opacity hover:opacity-70 disabled:opacity-50"
            >
              Mark as read
            </button>
          ) : null}
        </div>
      </div>

      {/* Removing hides it for this player only; everyone else keeps their copy. */}
      <button
        type="button"
        disabled={isBusy}
        aria-label="Remove notification"
        onClick={() => onRemove(notification._id)}
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#083F92] opacity-0 shadow-[0px_2px_4px_rgba(6,62,145,0.25)] transition-opacity hover:opacity-90 focus-visible:opacity-100 group-hover:opacity-100 disabled:opacity-40"
      >
        <X className="h-3.5 w-3.5 text-white" />
      </button>
    </div>
  );
}

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data: unreadData } = useUnreadCountQuery();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useNotificationsFeedQuery(open);

  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();
  const removeOne = useDeleteNotificationMutation();
  const clearAll = useClearAllNotificationsMutation();

  const notifications = useMemo(
    () => data?.pages.flatMap((page) => page.data.notifications) ?? [],
    [data],
  );

  // Prefer the dedicated count; fall back to the one the feed returns while
  // the first request is still in flight.
  const unreadCount =
    unreadData?.data.unreadCount ?? data?.pages[0]?.data.unreadCount ?? 0;

  const isBusy = markRead.isPending || removeOne.isPending;
  const isBulkBusy = markAllRead.isPending || clearAll.isPending;

  // Opening the panel is reading them, so the whole feed is marked read.
  //
  // Fired once per open, and only when there is something to mark: the
  // mutation invalidates the feed, so repeating it on every render would leave
  // the panel refetching itself while the reader is trying to use it.
  const hasMarkedThisOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      hasMarkedThisOpen.current = false;
      return;
    }

    if (hasMarkedThisOpen.current || unreadCount === 0) return;

    hasMarkedThisOpen.current = true;
    markAllRead.mutate();
  }, [open, unreadCount, markAllRead]);

  // Close on an outside click or Escape, the same way the profile menu does.
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  // Infinite scroll: fetch the next page when the sentinel at the bottom of the
  // list scrolls into view.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = scrollRef.current;
    if (!open || !sentinel || !root || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root, rootMargin: "80px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    open,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    notifications.length,
  ]);

  const handleRead = useCallback(
    (id: string) => markRead.mutate(id),
    [markRead],
  );
  /**
   * Removes a notification, letting the row collapse on its way out.
   *
   * The delete is optimistic, so the row leaves the cache the moment it is
   * asked for. Holding it for the length of the animation is what turns a row
   * vanishing mid-click into something the eye can follow.
   */
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  const handleRemove = useCallback(
    (id: string) => {
      setRemovingIds((current) =>
        current.includes(id) ? current : [...current, id],
      );

      window.setTimeout(() => {
        removeOne.mutate(id);
        setRemovingIds((current) => current.filter((item) => item !== id));
      }, REMOVE_ANIMATION_MS);
    },
    [removeOne],
  );

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "relative flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#083F92] shadow-[0px_4px_8px_rgba(6,62,145,0.25)] transition-opacity",
          open && "opacity-90",
        )}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Bell className="h-[18px] w-[18px] text-white" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-[20px] min-w-[20px] items-center justify-center rounded-full border-2 border-white bg-[#D92D20] px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+10px)] z-[60] w-[calc(100vw-2rem)] max-w-[400px] overflow-hidden rounded-2xl border border-[#DADADA] bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.12)]"
          role="menu"
          aria-label="Notifications"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[#F4F4F4] px-4 py-4">
            <div className="flex min-w-0 items-center gap-2">
              <p className="text-base font-semibold text-[#121111]">
                Notifications
              </p>
              {unreadCount > 0 ? (
                <span className="rounded-full bg-[#083F92] px-2 py-0.5 text-[11px] font-semibold text-white">
                  {unreadCount} new
                </span>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                title="Mark all as read"
                aria-label="Mark all as read"
                disabled={isBulkBusy || unreadCount === 0}
                onClick={() => markAllRead.mutate()}
                className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#083F92] shadow-[0px_2px_4px_rgba(6,62,145,0.25)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CheckCheck className="h-4 w-4 text-white" />
              </button>
              <button
                type="button"
                title="Clear all"
                aria-label="Clear all notifications"
                disabled={isBulkBusy || notifications.length === 0}
                onClick={() => clearAll.mutate()}
                className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#083F92] shadow-[0px_2px_4px_rgba(6,62,145,0.25)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="max-h-[440px] overflow-y-auto overscroll-contain"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm font-medium text-[#636363]">
                <Loader2 className="h-4 w-4 animate-spin text-[#083F92]" />
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#083F92]">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-[#121111]">
                  You&apos;re all caught up
                </p>
                <p className="text-xs font-medium leading-[18px] text-[#636363]">
                  Tournament registrations, schedule changes and membership
                  updates will show up here.
                </p>
              </div>
            ) : (
              <>
                {notifications.map((notification) => (
                  <NotificationRow
                    key={notification._id}
                    notification={notification}
                    onRead={handleRead}
                    onRemove={handleRemove}
                    isBusy={isBusy}
                    isRemoving={removingIds.includes(notification._id)}
                  />
                ))}

                <div ref={sentinelRef} className="h-px" />

                {isFetchingNextPage ? (
                  <div className="flex items-center justify-center gap-2 py-4 text-xs font-medium text-[#636363]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#083F92]" />
                    Loading more...
                  </div>
                ) : null}

                {!hasNextPage && notifications.length > 8 ? (
                  <p className="py-4 text-center text-[11px] font-medium text-[#8C8C8C]">
                    That&apos;s everything
                  </p>
                ) : null}
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
