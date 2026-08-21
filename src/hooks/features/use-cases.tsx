import { caseAPI } from "@/lib/api";
import { CaseParams } from "@/types/case";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CASE_QUERY_KEY = "cases";
const CASE_DETAILS_QUERY_KEY = "caseDetails";

export const useCases = (params?: CaseParams) => {
  return useQuery({
    queryKey: [CASE_QUERY_KEY, params],
    queryFn: () => caseAPI.getCases(params),
  });
};

export const useCaseDetails = (caseId: string) => {
  return useQuery({
    queryKey: [CASE_DETAILS_QUERY_KEY, caseId],
    queryFn: () => caseAPI.getCaseDetails(caseId),
    enabled: !!caseId,
  });
};

export const useCreateCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: caseAPI.createCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CASE_QUERY_KEY] });
    },
  });
};

export const useUpdateCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ caseId, payload }: { caseId: string; payload: any }) =>
      caseAPI.updateCase(caseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CASE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CASE_DETAILS_QUERY_KEY] });
    },
  });
};

export const useDeleteCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: caseAPI.deleteCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CASE_QUERY_KEY] });
    },
  });
};

export const useChangeCaseStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: caseAPI.changeStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CASE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CASE_DETAILS_QUERY_KEY] });
    },
  });
};

export const useApplyLegalHold = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: caseAPI.applyLegalHold,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CASE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CASE_DETAILS_QUERY_KEY] });
    },
  });
};

export const useRemoveLegalHold = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: caseAPI.removeLegalHold,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CASE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CASE_DETAILS_QUERY_KEY] });
    },
  });
};

export const useCreateDeadline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: caseAPI.createDeadline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CASE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CASE_DETAILS_QUERY_KEY] });
    },
  });
};
