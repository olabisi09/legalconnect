import { eventsAPI } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const EVENTS_QUERY_KEY = "events";
export const useEvents = (params: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: [EVENTS_QUERY_KEY, params],
    queryFn: () => eventsAPI.getEvents(params),
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventsAPI.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventsAPI.updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventsAPI.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
    },
  });
};
