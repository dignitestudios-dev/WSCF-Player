"use client";

import { useEffect, useRef, useState } from "react";
import { useNotifications } from "@/features/dashboard/hooks/use-notifications";
import { cn } from "@/utils/cn";

function NotificationTriggerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4C9.5 4 7.5 6 7.5 8.5V9.5L5.5 12.5V13.5H18.5V12.5L16.5 9.5V8.5C16.5 6 14.5 4 12 4Z"
        fill="white"
      />
      <path
        d="M10 16.5C10.4 17.6 11.1 18.5 12 18.5C12.9 18.5 13.6 17.6 14 16.5"
        stroke="white"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function TournamentNotificationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5L9.2 5.5H13.5L10 7.8L11.2 11.8L8 9.5L4.8 11.8L6 7.8L2.5 5.5H6.8L8 1.5Z"
        fill="white"
      />
    </svg>
  );
}

function AlertNotificationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5C6.2 1.5 4.8 3 4.8 4.8V5.4L3.2 7.6V8.4H12.8V7.6L11.2 5.4V4.8C11.2 3 9.8 1.5 8 1.5Z"
        fill="white"
      />
      <path
        d="M6.8 10.2C7 11 7.5 11.5 8 11.5C8.5 11.5 9 11 9.2 10.2"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RatingNotificationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2L12 7.5H17.5L13.25 11L14.75 16.5L10 13L5.25 16.5L6.75 11L2.5 7.5H8L10 2Z"
        fill="white"
      />
    </svg>
  );
}

function NotificationItemIcon({ type }: { type: DashboardNotification["icon"] }) {
  switch (type) {
    case "tournament":
      return <TournamentNotificationIcon />;
    case "alert":
      return <AlertNotificationIcon />;
    case "rating":
      return <RatingNotificationIcon />;
  }
}

function NotificationItem({ notification }: { notification: DashboardNotification }) {
  return (
    <article className="flex items-start gap-3 rounded-xl py-[15px]">
      <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#083F92]">
        <NotificationItemIcon type={notification.icon} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2.5">
          <h3 className="text-lg font-semibold leading-[21px] tracking-[-0.005em] text-[#083F92]">
            {notification.title}
          </h3>
          <span className="shrink-0 text-sm font-medium leading-[17px] tracking-[-0.005em] text-[#083F92]">
            {notification.time}
          </span>
        </div>
        <p className="text-sm font-medium leading-[19px] tracking-[-0.005em] text-[#121111]">
          {notification.message}
        </p>
      </div>
    </article>
  );
}

export default function NotificationPopup() {
  const { notifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!popupRef.current?.contains(event.target as Node)) {
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

  return (
    <div ref={popupRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#083F92] shadow-[0px_4px_8px_rgba(6,62,145,0.25)] transition-opacity",
          open && "opacity-90"
        )}
        aria-label="Notifications"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <NotificationTriggerIcon />
      </button>

      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+10px)] z-[60] box-border flex w-[450px] max-w-[calc(100vw-2rem)] flex-col gap-5 rounded-2xl border border-[rgba(239,239,239,0.86)] bg-white px-[15px] pb-[15px] pt-[30px] shadow-[0px_17px_7px_rgba(0,0,0,0.01),0px_10px_6px_rgba(0,0,0,0.05),0px_4px_4px_rgba(0,0,0,0.09),0px_1px_2px_rgba(0,0,0,0.1)]"
          role="dialog"
          aria-label="Notifications"
        >
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
