export interface Notification {
  notificationId: number;
  title: string | null;
  content: string | null;
  type: string | null;
  isRead: boolean;
  createdDate: string | null;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface NotificationMutationResponse {
  message: string;
  data: Notification;
}

export interface ReadAllNotificationsResponse {
  message: string;
  updatedCount: number;
}