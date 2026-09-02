import { hearingAPI } from "@/lib/api";
import { HearingParams } from "@/types/hearing";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const HEARINGS_QUERY_KEY = "hearings";

export const useHearings = (params?: HearingParams) => {
  return useQuery({
    queryKey: [HEARINGS_QUERY_KEY, params],
    queryFn: () => hearingAPI.getHearings(params),
  });
};

export const useHearingDetails = (hearingId: string) => {
  return useQuery({
    queryKey: ["hearing-details", hearingId],
    queryFn: () => hearingAPI.getHearingDetails(hearingId),
    enabled: !!hearingId,
  });
};

export const useCreateHearing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: hearingAPI.createHearing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HEARINGS_QUERY_KEY] });
    },
  });
};

export const useRescheduleHearing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: hearingAPI.reschedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HEARINGS_QUERY_KEY] });
    },
  });
};

export const useRecordHearingOutcome = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: hearingAPI.recordOutcome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HEARINGS_QUERY_KEY] });
    },
  });
};

export const useCancelHearing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: hearingAPI.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HEARINGS_QUERY_KEY] });
    },
  });
};

export const useDeleteHearing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: hearingAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HEARINGS_QUERY_KEY] });
    },
  });
};

export const useMarkHearingAsHeld = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: hearingAPI.markAsHeld,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HEARINGS_QUERY_KEY] });
    },
  });
};
