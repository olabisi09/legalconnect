import { documentAPI } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const DOCUMENTS_QUERY_KEY = "documents";

export const useDocuments = (caseId: string) => {
  return useQuery({
    queryKey: [DOCUMENTS_QUERY_KEY, caseId],
    queryFn: () => documentAPI.getDocuments(caseId),
    enabled: !!caseId,
  });
};

export const useDocumentDetail = (docId: string) => {
  return useQuery({
    queryKey: ["document", docId, "detail"],
    queryFn: () => documentAPI.getDocumentDetails(docId),
    enabled: !!docId,
  });
};

export const useRegisterDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: documentAPI.registerDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY] });
    },
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: documentAPI.uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY] });
    },
  });
};

export const useCreateTransition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: documentAPI.createTransition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY] });
    },
  });
};

export const useCheckInDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: documentAPI.checkInDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY] });
    },
  });
};

export const useCheckOutDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: documentAPI.checkOutDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY] });
    },
  });
};

export const useShareDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: documentAPI.share,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY] });
    },
  });
};

export const useDocumentTransition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: documentAPI.transition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY] });
    },
  });
};

export const useDownloadDocument = () => {
  return useMutation({
    mutationFn: documentAPI.downloadDocument,
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: documentAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY] });
    },
  });
};
