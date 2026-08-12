import { mattersAPI } from "@/lib/api";
import { MatterParams } from "@/types/matter";
import { useQuery, useMutation } from "@tanstack/react-query";

export const useMatters = (params?: MatterParams) => {
  return useQuery({
    queryKey: ["matters", params],
    queryFn: () => mattersAPI.getMatters(params),
  });
};

export const useCreateMatter = () => {
  return useMutation({
    mutationFn: mattersAPI.createMatter,
  });
};
