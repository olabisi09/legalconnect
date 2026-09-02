import { dashboardAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const DASHBOARD_QUERY_KEY = "dashboard";

export const useDashboard = () => {
  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY],
    queryFn: () => dashboardAPI.getDashboard(),
  });
};
