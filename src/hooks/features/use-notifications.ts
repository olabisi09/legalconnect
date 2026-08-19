import { notificationAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const NOTIFICATIONS_QUERY_KEY = "notifications";
export const useNotifications = (params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, params],
    queryFn: () => notificationAPI.getNotifications(params),
  });
};

export const useNotificationUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationAPI.getUnreadCount(),
  });
};
