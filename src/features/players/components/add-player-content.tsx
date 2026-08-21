"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import ChildProfileCard from "@/features/auth/components/child-profile-card";
import ChildProfileDialog from "@/features/auth/components/child-profile-dialog";
import type { ChildFormData } from "@/features/auth/schemas/child.schema";
import { useCreateChildMutation } from "@/features/players/api/children.queries";
import { MEMBERSHIP_VALIDATION_ROUTE } from "@/config/routes";
import { showApiErrorToast } from "@/lib/api-toast";

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
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  // Which card the dialog is editing; null means it is adding a new one.
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { mutateAsync: createChildren, isPending } = useCreateChildMutation();

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
      if (editingIndex === null) return [...current, child];

      const next = [...current];
      next[editingIndex] = child;
      return next;
    });
  };

  const removeChild = (index: number) => {
    setChildren((current) => current.filter((_, i) => i !== index));
  };

  const total = children.length * MEMBERSHIP_UNIT_PRICE;

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

      {children.length === 0 ? (
        <button
          type="button"
          onClick={openAddChild}
          className="flex w-full flex-col items-center gap-2 rounded-[20px] border border-dashed border-[#3D3775]/40 bg-[#F7F6FF] px-4 py-8 text-center transition-colors hover:border-[#3D3775] hover:bg-[#ECEAFF]"
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

          <button
            type="button"
            onClick={openAddChild}
            className="flex w-full items-center justify-center gap-2 rounded-[20px] border border-dashed border-[#3D3775]/40 bg-[#F7F6FF] px-4 py-4 text-sm font-semibold text-[#083F92] transition-colors hover:border-[#3D3775] hover:bg-[#ECEAFF]"
          >
            <UserPlus className="h-4 w-4" />
            Add another player
          </button>

          <div className="flex items-center justify-between rounded-[20px] border border-[#D8D4FF] bg-white px-4 py-3">
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
          disabled={children.length === 0 || isPending}
          className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Continue"}
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
