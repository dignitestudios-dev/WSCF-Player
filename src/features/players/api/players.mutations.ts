import { useMutation } from "@tanstack/react-query";
import { attachProfile } from "@/features/players/api/players.service";

export function useAttachProfileMutation() {
  return useMutation({
    mutationFn: (payload: { masterPlayerId: string }) => attachProfile(payload),
  });
}
