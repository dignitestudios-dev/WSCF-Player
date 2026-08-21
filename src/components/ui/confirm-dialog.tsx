"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A single confirmation panel, so every "are you sure?" in the app looks and
 * behaves the same.
 *
 * Mounted only while open — the caller renders it conditionally.
 */
export default function ConfirmDialog({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  tone = "primary",
  icon: Icon,
  isLoading = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: "primary" | "danger";
  icon?: LucideIcon;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default bg-black/40"
        onClick={onCancel}
      />

      <div className="relative z-10 w-full max-w-[440px] rounded-[24px] bg-white p-6 text-center shadow-xl sm:p-8">
        {Icon && (
          <div
            className={cn(
              "mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full",
              tone === "danger" ? "bg-[#D92D20]" : "bg-[#083F92]",
            )}
          >
            <Icon className="h-7 w-7 text-white" />
          </div>
        )}

        <h2 className="text-xl font-semibold leading-7 text-[#083F92]">
          {title}
        </h2>
        <div className="mt-2 text-sm leading-5 text-[#565656]">
          {description}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="h-12 w-full rounded-[24px] border border-[#3D3775] bg-white text-sm font-semibold capitalize text-[#3D3775] transition-colors hover:bg-[#F7F6FF] disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "h-12 w-full rounded-[24px] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors disabled:opacity-50",
              tone === "danger"
                ? "bg-[#D92D20] hover:bg-[#B42318]"
                : "bg-[#083F92] hover:bg-[#063875]",
            )}
          >
            {isLoading ? "Working..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
