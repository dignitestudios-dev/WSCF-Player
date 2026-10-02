"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import ChildProfileCard from "@/features/auth/components/child-profile-card";
import ChildProfileDialog from "@/features/auth/components/child-profile-dialog";
import type { ChildFormData } from "@/features/auth/schemas/child.schema";
import {
  useChildrenQuery,
  useCreateChildMutation,
} from "@/features/players/api/children.queries";
import { MEMBERSHIP_VALIDATION_ROUTE } from "@/config/routes";
import { showApiErrorToast } from "@/lib/api-toast";
import {
  MAX_PLAYERS_PER_ACCOUNT,
  PLAYER_LIMIT_MESSAGE,
} from "@/config/limits";

/** What one membership costs, per player. */
const MEMBERSHIP_UNIT_PRICE = 5;

/**
 * Adding more players to an existing account.
 *
 * Deliberately the same shape as signup: add as many as you like, see the
 * total, then go through the one membership screen and pay for them together.
 *
 * Nothing is charged and nothing is final until that payment lands. Players
 * added here are provisional, so backing out of checkout removes them rather
 * than leaving players on the account who cannot enter anything.
 */
export default function AddPlayerContent() {
  const router = useRouter();

  const [children, setChildren] = useState<ChildFormData[]>([]);
  // Starts closed, then opens itself once — see the effect below. It used to
  // start open, which cannot work now that whether there is room to add is
  // something the screen has to load first.
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const hasAutoOpened = useRef(false);
  // Which card the dialog is editing; null means it is adding a new one.
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { mutateAsync: createChildren, isPending } = useCreateChildMutation();

  // This screen builds a fresh list, so on its own it has no idea the account
  // already holds players. Without the existing count it would happily collect
  // a fifth profile and only fail at the server.
  const { data: existingData, isLoading: isLoadingExisting } =
    useChildrenQuery();
  const existingCount = existingData?.children?.length ?? 0;
  const remainingSlots = Math.max(MAX_PLAYERS_PER_ACCOUNT - existingCount, 0);

  const openAddChild = () => {
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  const openEditChild = (index: number) => {
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const saveChild = (child: ChildFormData) => {
    setChildren((current) => {
      // Guarded here as well as on the buttons: editing is allowed at the
      // limit, adding is not, and this is the one place both arrive.
      if (editingIndex === null) {
        if (current.length >= remainingSlots) return current;
        return [...current, child];
      }

      const next = [...current];
      next[editingIndex] = child;
      return next;
    });
  };

  const removeChild = (index: number) => {
    setChildren((current) => current.filter((_, i) => i !== index));
  };

  const total = children.length * MEMBERSHIP_UNIT_PRICE;

  const isAtLimit = children.length >= remainingSlots;
  const hasNoSlots = remainingSlots === 0;

  // Arriving here is itself the intent to add someone, so the form opens on its
  // own rather than making the parent press Add first. Only once, and only when
  // the account has room — opening a form that cannot be submitted would be a
  // worse welcome than the message explaining why.
  useEffect(() => {
    if (hasAutoOpened.current || isLoadingExisting) return;
    hasAutoOpened.current = true;
    if (remainingSlots > 0) setIsDialogOpen(true);
  }, [isLoadingExisting, remainingSlots]);

  const continueToPayment = async () => {
    if (children.length === 0) return;

    try {
      await createChildren({
        children: children.map((child) => ({
          firstName: child.firstName,
          lastName: child.lastName,
          gender: child.gender,
          grade: child.grade,
          dob: child.birthDate,
        })),
      });

      // The same membership screen signup uses: it reads the quote from the
      // API, so the new players are already on the bill.
      router.push(MEMBERSHIP_VALIDATION_ROUTE);
    } catch (error) {
      showApiErrorToast(error as Error, "Could not add the players.");
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-6 flex w-full flex-col items-center gap-2 text-center">
        <div className="mb-2 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#083F92]">
          <UserPlus className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-[28px] font-semibold leading-9 text-[#083F92]">
          Add Players
        </h1>
        <p className="text-sm font-medium leading-5 text-[#565656]">
          Add each child you want on your account. Each player needs their own
          membership.
        </p>
      </div>

      {hasNoSlots ? (
        /* The account is full. Nothing to add, so the screen says so instead of
           offering a form that cannot be submitted. */
        <div className="flex w-full flex-col items-center gap-2 rounded-[24px] border border-[#D8D4FF] bg-[#F7F6FF] px-4 py-8 text-center">
          <UserPlus className="h-6 w-6 text-[#083F92]" />
          <span className="text-sm font-semibold text-[#083F92]">
            {PLAYER_LIMIT_MESSAGE}
          </span>
          <span className="text-xs text-[#565656]">
            Your account already has {existingCount}{" "}
            {existingCount === 1 ? "player" : "players"}.
          </span>
        </div>
      ) : children.length === 0 ? (
        <button
          type="button"
          onClick={openAddChild}
          className="flex w-full flex-col items-center gap-2 rounded-[24px] border border-dashed border-[#3D3775]/40 bg-[#F7F6FF] px-4 py-8 text-center transition-colors hover:border-[#3D3775] hover:bg-[#ECEAFF]"
        >
          <UserPlus className="h-6 w-6 text-[#083F92]" />
          <span className="text-sm font-semibold text-[#083F92]">
            Add a player
          </span>
          <span className="text-xs text-[#565656]">
            ${MEMBERSHIP_UNIT_PRICE.toFixed(2)} per player, per season
          </span>
        </button>
      ) : (
        <div className="flex w-full flex-col gap-3">
          {children.map((child, index) => (
            <ChildProfileCard
              key={`${child.firstName}-${child.lastName}-${index}`}
              child={child}
              onEdit={() => openEditChild(index)}
              onRemove={() => removeChild(index)}
            />
          ))}

          {/* The button goes entirely at the limit; the message stands in its
              place so the list does not simply end without explanation. */}
          {isAtLimit ? (
            <p className="rounded-[24px] bg-[#F7F6FF] px-4 py-4 text-center text-xs leading-4 text-[#565656]">
              {existingCount > 0
                ? `That is all ${MAX_PLAYERS_PER_ACCOUNT} players your account can hold.`
                : PLAYER_LIMIT_MESSAGE}
            </p>
          ) : (
            <button
              type="button"
              onClick={openAddChild}
              className="flex w-full items-center justify-center gap-2 rounded-[24px] border border-dashed border-[#3D3775]/40 bg-[#F7F6FF] px-4 py-4 text-sm font-semibold text-[#083F92] transition-colors hover:border-[#3D3775] hover:bg-[#ECEAFF]"
            >
              <UserPlus className="h-4 w-4" />
              Add another player
            </button>
          )}

          <div className="flex items-center justify-between rounded-[24px] border border-[#D8D4FF] bg-white px-4 py-3">
            <span className="text-sm leading-5 text-[#565656]">
              {children.length} {children.length === 1 ? "player" : "players"} ×
              ${MEMBERSHIP_UNIT_PRICE.toFixed(2)}
            </span>
            <span className="text-base font-semibold text-[#083F92]">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div className="mt-6 flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={continueToPayment}
          disabled={children.length === 0 || isPending || hasNoSlots}
          className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save and make payment"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="h-12 w-full rounded-[24px] border border-[#3D3775] bg-white text-sm font-semibold capitalize text-[#3D3775] transition-colors hover:bg-[#F7F6FF]"
        >
          Cancel
        </button>
      </div>

      {isDialogOpen && (
        <ChildProfileDialog
          onClose={() => setIsDialogOpen(false)}
          onSubmit={saveChild}
          initialValue={editingIndex === null ? null : children[editingIndex]}
        />
      )}
    </div>
  );
}
