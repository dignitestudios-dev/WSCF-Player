"use client";

import { useState } from "react";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useChangeEmailMutation } from "@/features/auth/api/auth.mutations";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
} from "@/components/ui/responsive-dialog";
import { showApiErrorToast, showApiSuccessToast } from "@/lib/api-toast";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(254, "Email cannot exceed 254 characters")
  .email("Invalid email address");

interface ChangeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
  /** Called after the change went through. */
  onChanged?: (email: string) => void;
}

/**
 * Lets a parent fix the address on an account that is not verified yet.
 *
 * The email is also what they sign in with, so the dialog says so before
 * anything is typed. The API refuses an address another account already uses
 * and answers in plain words, which are shown as they come.
 */
export default function ChangeEmailDialog({
  open,
  onOpenChange,
  currentEmail,
  onChanged,
}: ChangeEmailDialogProps) {
  const queryClient = useQueryClient();
  const { mutate: changeEmail, isPending } = useChangeEmailMutation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function close(next: boolean) {
    if (!next) {
      setEmail("");
      setError(null);
    }
    onOpenChange(next);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email address");
      return;
    }
    if (parsed.data.toLowerCase() === currentEmail.toLowerCase()) {
      setError("That is already your email address.");
      return;
    }

    setError(null);
    changeEmail(
      { email: parsed.data },
      {
        onSuccess: (response) => {
          showApiSuccessToast(response, "Email changed");
          // Everything showing the old address, the banner included.
          queryClient.invalidateQueries({ queryKey: ["authUser"] });
          onChanged?.(response.email);
          close(false);
        },
        onError: (err) => {
          setError(err.message);
          showApiErrorToast(err, "Could not change your email.");
        },
      }
    );
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={close}>
      <ResponsiveDialogContent
        showCloseButton
        className="flex w-full max-w-[460px] flex-col gap-5 rounded-xl bg-white p-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
        mobileClassName="gap-5"
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-[#212121]">
            Change your email
          </h2>
          <p className="text-sm leading-5 text-[#565656]">
            This is the email you sign in with. After you change it you will
            sign in with the new address, and we will send the verification
            link there. You can only do this while your email is not verified.
          </p>
          <p className="text-sm text-[#565656]">
            Current email:{" "}
            <strong className="break-all text-[#181818]">{currentEmail}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="change-email-input"
              className="text-sm font-medium text-[#181818]"
            >
              New email address
            </label>
            <input
              id="change-email-input"
              type="email"
              maxLength={254}
              autoComplete="email"
              value={email}
              disabled={isPending}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 w-full rounded-[24px] border border-[#3D3775] bg-white px-4 text-sm text-[#181818] outline-none focus:ring-2 focus:ring-[#083F92]/15"
            />
            {error && (
              <p className="text-xs text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => close(false)}
              disabled={isPending}
              className="h-11 flex-1 rounded-[24px] border border-[#083F92] bg-white text-sm font-semibold text-[#083F92] transition-colors hover:bg-[#F5F7FB] disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="h-11 flex-1 rounded-[24px] bg-[#083F92] text-sm font-semibold text-white transition-colors hover:bg-[#063875] disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Change email"}
            </button>
          </div>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
