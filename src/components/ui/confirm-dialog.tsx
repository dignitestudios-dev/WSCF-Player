"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";

/**
 * A single confirmation panel, so every "are you sure?" in the app looks and
 * behaves the same. A bottom drawer on a phone, a centred dialog from `md` up.
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
    // Not dismissible mid-request: backing out while the action runs would leave
    // the person guessing whether it happened.
    <ResponsiveDialog
      open
      onOpenChange={(open) => {
        if (!open && !isLoading) onCancel();
      }}
      dismissible={!isLoading}
    >
      <ResponsiveDialogContent
        className="rounded-[24px] p-6 text-center sm:max-w-[440px] sm:p-8"
        mobileClassName="text-center"
      >
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

        <ResponsiveDialogTitle className="text-xl font-semibold leading-7 text-[#083F92]">
          {title}
        </ResponsiveDialogTitle>
        {/* A div, not the default <p>: callers pass rich content. */}
        <ResponsiveDialogDescription
          render={<div />}
          className="mt-2 text-sm leading-5 text-[#565656]"
        >
          {description}
        </ResponsiveDialogDescription>

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
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
