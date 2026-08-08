import { profileAPI } from "@/lib/api";
import { normalizeApiError } from "@/lib/error";
import {
  LawyerProfileResponse,
  UpdateLawyerProfileRequest,
  UpdateUserProfileRequest,
} from "@/types/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const profileQueryKey = (userId: string) => ["user-profile", userId] as const;
const lawyerProfileQueryKey = (userId: string) =>
  ["lawyer-profile", userId] as const;

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: userId ? profileQueryKey(userId) : ["user-profile", "missing"],
    enabled: Boolean(userId),
    queryFn: () => profileAPI.getUserProfile(userId as string),
  });
}

export function useUpdateUserProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserProfileRequest) =>
      profileAPI.updateUserProfile(userId as string, payload),
    onSuccess: () => {
      if (!userId) return;
      void queryClient.invalidateQueries({ queryKey: profileQueryKey(userId) });
    },
  });
}

export function useLawyerProfile(userId: string | undefined) {
  return useQuery<LawyerProfileResponse | null>({
    queryKey: userId
      ? lawyerProfileQueryKey(userId)
      : ["lawyer-profile", "missing"],
    enabled: Boolean(userId),
    queryFn: async () => {
      try {
        return await profileAPI.getLawyerProfile(userId as string);
      } catch (error) {
        const normalized = normalizeApiError(error);

        // Empty state for first-time lawyer profile setup.
        if (normalized.status === 404) {
          return null;
        }

        throw error;
      }
    },
  });
}

export function useUpsertLawyerProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLawyerProfileRequest) =>
      profileAPI.upsertLawyerProfile(userId as string, payload),
    onSuccess: () => {
      if (!userId) return;
      void queryClient.invalidateQueries({
        queryKey: lawyerProfileQueryKey(userId),
      });
    },
  });
}
