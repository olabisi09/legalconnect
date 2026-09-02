export interface Notification {
  id: string;
  userId?: string;
  type: string;
  title: string;
  body: string;
  resourceType: string;
  resourceId: string;
  isRead: boolean;
  readAt: string;
  createdAt: string;
}
