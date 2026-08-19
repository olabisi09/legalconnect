import { mattersAPI } from "@/lib/api";
import { MatterParams } from "@/types/matter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const MATTERS_QUERY_KEY = "matters";
const MATTER_DETAILS_QUERY_KEY = "matterDetails";

export const useMatters = (params?: MatterParams) => {
  return useQuery({
    queryKey: [MATTERS_QUERY_KEY, params],
    queryFn: () => mattersAPI.getMatters(params),
  });
};

export const useMatterDetails = (matterId: string) => {
  return useQuery({
    queryKey: [MATTER_DETAILS_QUERY_KEY, matterId],
    queryFn: () => mattersAPI.getMatterDetails(matterId),
    enabled: !!matterId,
  });
};

export const useCreateMatter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mattersAPI.createMatter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATTERS_QUERY_KEY] });
    },
  });
};

export const useUpdateMatter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ matterId, payload }: { matterId: string; payload: any }) =>
      mattersAPI.updateMatter(matterId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATTERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MATTER_DETAILS_QUERY_KEY] });
    },
  });
};

export const useDeleteMatter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mattersAPI.deleteMatter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATTERS_QUERY_KEY] });
    },
  });
};

export const useChangeMatterStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mattersAPI.changeStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATTERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MATTER_DETAILS_QUERY_KEY] });
    },
  });
};

export const useApplyLegalHold = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mattersAPI.applyLegalHold,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATTERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MATTER_DETAILS_QUERY_KEY] });
    },
  });
};

export const useRemoveLegalHold = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mattersAPI.removeLegalHold,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MATTERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MATTER_DETAILS_QUERY_KEY] });
    },
  });
};
