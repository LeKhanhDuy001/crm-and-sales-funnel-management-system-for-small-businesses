import { apiRequest } from '../../services/api';
import type { Notification, NotificationMutationResponse, ReadAllNotificationsResponse, UnreadCountResponse, } from './notifications.types';

export async function getNotifications(accessToken: string,): Promise<Notification[]> {
  return apiRequest<Notification[]>(
    '/notifications',
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function getUnreadCount(accessToken: string,): Promise<UnreadCountResponse> {
  return apiRequest<UnreadCountResponse>(
    '/notifications/unread-count',
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function markNotificationAsRead(accessToken: string, notificationId: number,): Promise<NotificationMutationResponse> {
  return apiRequest<NotificationMutationResponse>(
    `/notifications/${notificationId}/read`,
    {
      method: 'PATCH',
      accessToken,
    },
  );
}

export async function markAllNotificationsAsRead(accessToken: string,): Promise<ReadAllNotificationsResponse> {
  return apiRequest<ReadAllNotificationsResponse>(
    '/notifications/read-all',
    {
      method: 'PATCH',
      accessToken,
    },
  );
}