"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Link2, Search, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import {
  useChildMatchesQuery,
  useChildrenQuery,
  useResolveMasterFileMutation,
} from "@/features/players/api/children.queries";
import { SELECT_PLAYER_ROUTE } from "@/features/players/routes";
import { DEFAULT_REDIRECT } from "@/config/routes";
import { showApiErrorToast } from "@/lib/api-toast";

/**
 * Linking each player to their existing record in the master players file.
 *
 * One child at a time, and every child has to be answered — including the ones
 * with no match, because "we looked and found nothing" is a different state
 * from "nobody has looked yet". The server records that distinction, which is
 * what lets this screen be resumed from another browser exactly where it was
 * left rather than starting over or being skipped.
 *
 * Only the name and rating are shown: the rating is the only thing that gets
 * copied across, so grade and team would just be noise to weigh up.
 */
export default function ClaimRatingsContent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: childrenData, isLoading: isLoadingChildren } =
    useChildrenQuery();
  const { mutateAsync: resolve, isPending: isSaving } =
    useResolveMasterFileMutation();

  // Whoever is still unanswered, oldest first — the same order every time, so
  // reloading resumes rather than restarts.
  const pending = useMemo(
    () => (childrenData?.children ?? []).filter((c) => !c.masterFileChecked),
    [childrenData],
  );

  const current = pending[0] ?? null;

  const { data: matchData, isLoading: isLoadingMatches } = useChildMatchesQuery(
    current?._id ?? null,
  );

  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<"link" | "none" | null>(null);

  // Moving to the next child must not inherit the previous one's choice.
  useEffect(() => {
    setSelectedMatchId(null);
  }, [current?._id]);

  // Handing over exactly once. Without the guard the effect can fire again
  // while the route change is still in flight, and the two screens bounce off
  // each other until the caches happen to agree.
  const hasHandedOver = useRef(false);

  useEffect(() => {
    if (isLoadingChildren || hasHandedOver.current) return;

    const total = childrenData?.children.length ?? 0;
    if (total === 0 || pending.length > 0) return;

    hasHandedOver.current = true;
    router.replace(total > 1 ? SELECT_PLAYER_ROUTE : DEFAULT_REDIRECT);
  }, [isLoadingChildren, pending.length, childrenData, router]);

  if (isLoadingChildren || !current) {
    return (
      <div className="flex w-full flex-col gap-3">
        <div className="h-6 w-2/3 animate-pulse rounded-full bg-[#F2F2F2]" />
        <div className="h-[84px] w-full animate-pulse rounded-[20px] bg-[#F2F2F2]" />
      </div>
    );
  }

  const matches = matchData?.matches ?? [];
  const answeredCount = (childrenData?.children.length ?? 0) - pending.length;
  const totalCount = childrenData?.children.length ?? 0;
  const chosen = matches.find((match) => match._id === selectedMatchId);

  const submit = async (masterPlayerId: string | null) => {
    setConfirming(null);

    try {
      await resolve({ childId: current._id, masterPlayerId });

      // The gate that decides where the app sends people next lives on the
      // account, so it has to catch up before this screen hands over —
      // otherwise the next screen still believes a lookup is outstanding and
      // sends everyone straight back here.
      await queryClient.refetchQueries({ queryKey: ["authUser"] });
    } catch (error) {
      // A record someone else claimed first lands here. The list is refetched,
      // so the parent simply picks again.
      showApiErrorToast(error as Error, "Could not link that record.");
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-6 flex w-full flex-col items-center gap-2 text-center">
        <span className="rounded-full bg-[#ECEAFF] px-3 py-1 text-xs font-semibold text-[#3D3775]">
          Player {answeredCount + 1} of {totalCount}
        </span>
        <h1 className="text-[28px] font-semibold leading-9 text-[#083F92]">
          Is this {current.firstName}?
        </h1>
        <p className="text-sm font-medium leading-5 text-[#565656]">
          We searched our records for{" "}
          <strong className="text-[#181818]">
            {current.firstName} {current.lastName}
          </strong>
          . Linking the right one brings their rating across.
        </p>
      </div>

      {isLoadingMatches ? (
        <div className="flex w-full flex-col gap-3">
          {[0, 1].map((key) => (
            <div
              key={key}
              className="h-[76px] w-full animate-pulse rounded-[20px] bg-[#F2F2F2]"
            />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="flex w-full flex-col items-center gap-3 rounded-[20px] border border-dashed border-[#3D3775]/40 bg-[#F7F6FF] px-4 py-8 text-center">
          <Search className="h-6 w-6 text-[#083F92]" />
          <p className="text-sm font-semibold text-[#083F92]">
            No existing record found
          </p>
          <p className="max-w-[380px] text-xs leading-4 text-[#565656]">
            {current.firstName} will start with a new profile and no rating.
            That is completely normal for a first-time player.
          </p>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-3">
          {matches.map((match) => {
            const selected = match._id === selectedMatchId;
            return (
              <button
                key={match._id}
                type="button"
                onClick={() => setSelectedMatchId(match._id)}
                aria-pressed={selected}
                className={cn(
                  "flex w-full items-center gap-4 rounded-[20px] border bg-white p-4 text-left transition-colors",
                  selected
                    ? "border-[#083F92] bg-[#F2F6FF] shadow-[0px_4px_12px_rgba(8,63,146,0.12)]"
                    : "border-[#DADADA] hover:border-[#083F92]/50 hover:bg-[#F7F6FF]",
                )}
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate text-base font-semibold leading-[22px] text-[#121111]">
                    {match.firstName} {match.lastName}
                  </p>
                  {/* The rating is the whole point: it is the only thing that
                      gets copied onto the player's profile. */}
                  <p className="truncate text-sm leading-5 text-[#636363]">
                    Rating {match.localRating}
                  </p>
                </div>

                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                    selected
                      ? "border-[#083F92] bg-[#083F92]"
                      : "border-[#DADADA] bg-white",
                  )}
                >
                  {selected && <Check className="h-3.5 w-3.5 text-white" />}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex w-full flex-col gap-3">
        {matches.length > 0 && (
          <button
            type="button"
            disabled={!selectedMatchId || isSaving}
            onClick={() => setConfirming("link")}
            className="h-12 w-full rounded-[24px] bg-[#083F92] text-sm font-semibold capitalize text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875] disabled:opacity-50"
          >
            {`Yes, this is ${current.firstName}`}
          </button>
        )}

        <button
          type="button"
          disabled={isSaving}
          onClick={() => setConfirming("none")}
          className={cn(
            "h-12 w-full rounded-[24px] text-sm font-semibold capitalize transition-colors disabled:opacity-50",
            matches.length > 0
              ? "border border-[#3D3775] bg-white text-[#3D3775] hover:bg-[#F7F6FF]"
              : "bg-[#083F92] text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] hover:bg-[#063875]",
          )}
        >
          {matches.length > 0 ? "None of these" : "Continue"}
        </button>
      </div>

      {/* Both answers are asked about, because both are final: linking claims
          a record nobody else can then claim, and declining closes the lookup
          for this player for good. */}
      {confirming === "link" && chosen && (
        <ConfirmDialog
          icon={Link2}
          title={`Link this record to ${current.firstName}?`}
          description={
            <>
              <strong className="text-[#181818]">
                {chosen.firstName} {chosen.lastName}
              </strong>{" "}
              has a rating of{" "}
              <strong className="text-[#181818]">{chosen.localRating}</strong>.
              That rating will be copied to {current.firstName}&apos;s profile
              and the record cannot be claimed by anyone else.
            </>
          }
          confirmText="Yes, link it"
          cancelText="Go back"
          isLoading={isSaving}
          onConfirm={() => submit(selectedMatchId)}
          onCancel={() => setConfirming(null)}
        />
      )}

      {confirming === "none" && (
        <ConfirmDialog
          icon={SearchX}
          title={
            matches.length > 0
              ? `None of these are ${current.firstName}?`
              : `Continue without a rating?`
          }
          description={
            <>
              {current.firstName} will start with a new profile and no rating,
              and we will not ask about this again. If one of these is them,
              go back and pick it — a rating cannot be linked later.
            </>
          }
          confirmText="Yes, continue"
          cancelText="Go back"
          isLoading={isSaving}
          onConfirm={() => submit(null)}
          onCancel={() => setConfirming(null)}
        />
      )}
    </div>
  );
}
