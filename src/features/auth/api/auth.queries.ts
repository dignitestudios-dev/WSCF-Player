import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, updateProfile, UpdateUserProfilePayload } from "@/features/auth/api/auth.service";

export function useAuthUserQuery() {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: () => getMe(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) => updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
}
