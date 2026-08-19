import { eventsAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const EVENTS_QUERY_KEY = "events";
export const useEvents = (params: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: [EVENTS_QUERY_KEY, params],
    queryFn: () => eventsAPI.getEvents(params),
  });
};
