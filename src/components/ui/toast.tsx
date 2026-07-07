"use client";

import { cn } from "@/utils/cn";

export type ToastType = "success" | "error";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

function SuccessIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 12.5L10.5 15L16 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 8V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface ToastMessageProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export function ToastMessage({ toast, onDismiss }: ToastMessageProps) {
  const isSuccess = toast.type === "success";

  return (
    <div
      role="alert"
      className={cn(
        "toast-enter flex w-full max-w-sm items-start gap-3 rounded-xl px-4 py-3 text-white shadow-[0_8px_24px_rgba(15,23,42,0.2)]",
        isSuccess ? "bg-emerald-600" : "bg-red-600"
      )}
    >
      <span className="mt-0.5 shrink-0 text-white">
        {isSuccess ? <SuccessIcon /> : <ErrorIcon />}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">
          {isSuccess ? "Success" : "Error"}
        </p>
        <p className="mt-0.5 text-sm leading-snug text-white/95">{toast.message}</p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded-md p-1 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
        aria-label="Dismiss notification"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex w-[min(100vw-2rem,24rem)] flex-col gap-3"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastMessage toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
