"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthUserQuery } from "@/features/auth/api/auth.queries";
import {
  ACTIVE_PROFILE_EVENT,
  getActiveProfileId,
  setActiveProfileId,
} from "@/features/players/active-profile";

/**
 * Who the app is currently showing.
 *
 * The account belongs to the parent, but every screen is one child's: this
 * resolves the stored choice against the children the API actually returns, so
 * a stale id — a child edited on another device, a switch made in another tab —
 * can never leave the app scoped to nobody.
 *
 * With exactly one child there is nothing to choose, so it selects itself and
 * neither the picker nor the switch option is ever shown.
 */
export function useActivePlayer() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useAuthUserQuery();

  const [storedId, setStoredId] = useState<string | null>(null);

  // localStorage is read after mount, never during render: the server has no
  // idea which child is selected, and reading it during render would make the
  // first paint disagree with the markup it hydrates.
  useEffect(() => {
    setStoredId(getActiveProfileId());

    const onChange = () => setStoredId(getActiveProfileId());
    window.addEventListener(ACTIVE_PROFILE_EVENT, onChange);
    return () => window.removeEventListener(ACTIVE_PROFILE_EVENT, onChange);
  }, []);

  const children: PlayerChild[] = data?.data?.children ?? [];

  // A deactivated player cannot be acted as, so a stored choice pointing at
  // one resolves to nobody and the picker asks again.
  const selectablePlayers = children.filter(
    (child) => child.status !== "inactive" && child.isActive !== false,
  );

  const activePlayer =
    selectablePlayers.find((child) => child._id === storedId) ??
    (selectablePlayers.length === 1 ? selectablePlayers[0] : null);

  /** Switch the whole app to another child. */
  const switchTo = useCallback(
    (childId: string) => {
      setActiveProfileId(childId);
      setStoredId(childId);

      // Every cached list is the previous child's — tournaments, history,
      // notifications, registrations. None of it belongs to this one.
      queryClient.clear();
    },
    [queryClient],
  );

  return {
    account: data?.data?.user ?? null,
    children,
    /** The ones that can actually be opened. */
    selectablePlayers,
    activePlayer,
    /** No picker and no switch option for an only child. */
    hasMultiplePlayers: children.length > 1,
    needsMembershipPayment: Boolean(data?.data?.needsMembershipPayment),
    needsMasterFileCheck: Boolean(data?.data?.needsMasterFileCheck),
    isLoading,
    switchTo,
  };
}
