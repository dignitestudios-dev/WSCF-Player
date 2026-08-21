import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createChild,
  discardUnpaidChildren,
  getChildMatches,
  getChildren,
  resolveChildMasterFile,
  updateChild,
  type ChildPayload,
} from "@/features/players/api/children.service";

export const playersKeys = {
  children: ["players", "children"] as const,
  matches: (childId: string) => ["players", "matches", childId] as const,
};

export function useChildrenQuery(enabled = true) {
  return useQuery({
    queryKey: playersKeys.children,
    queryFn: getChildren,
    enabled,
  });
}

export function useCreateChildMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChildPayload | { children: ChildPayload[] }) =>
      createChild(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playersKeys.children });
      // The account now owes another membership, so /me changes too.
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
}

export function useUpdateChildMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      childId,
      payload,
    }: {
      childId: string;
      payload: ChildPayload;
    }) => updateChild(childId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playersKeys.children });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
}

/** Discards players added but never paid for, after an abandoned checkout. */
export function useDiscardUnpaidChildrenMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: discardUnpaidChildren,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playersKeys.children });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["membership", "quote"] });
    },
  });
}

export function useChildMatchesQuery(childId: string | null) {
  return useQuery({
    queryKey: playersKeys.matches(childId || "none"),
    queryFn: () => getChildMatches(childId as string),
    enabled: Boolean(childId),
    // Claiming is one-shot per child, so a cached list could offer a record
    // another parent has since taken.
    staleTime: 0,
  });
}

export function useResolveMasterFileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      childId,
      masterPlayerId,
    }: {
      childId: string;
      masterPlayerId: string | null;
    }) => resolveChildMasterFile(childId, masterPlayerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playersKeys.children });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
}
