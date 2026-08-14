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
