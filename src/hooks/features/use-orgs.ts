import { useQuery } from "@tanstack/react-query";
import { orgAPI } from "@/lib/api";
import { OrganizationParams } from "@/types/organization";

const ORGS_QUERY_KEY = "organizations";

export const useOrgs = (params?: OrganizationParams) => {
  return useQuery({
    queryKey: [ORGS_QUERY_KEY, params],
    queryFn: () => orgAPI.getOrgs(params),
  });
};

export const useOrgProfile = (id: string) => {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: () => orgAPI.getOrgDetails(id),
    enabled: !!id,
  });
};
