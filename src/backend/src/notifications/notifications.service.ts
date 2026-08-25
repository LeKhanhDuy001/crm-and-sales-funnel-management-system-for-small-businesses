import { Injectable, NotFoundException } from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { NotificationsRepository } from './repositories/notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  /**
   * Lấy danh sách thông báo của người dùng đang đăng nhập.
   *
   * @param user Người dùng hiện tại.
   * @returns Danh sách thông báo thuộc người dùng.
   */
  async findMyNotifications(user: AuthenticatedUser) {
    const notifications = await this.notificationsRepository.findManyByUserId(
      user.userId,
    );
    return notifications.map((notification) =>
      this.mapNotification(notification),
    );
  }

  /**
   * Đếm số thông báo chưa đọc của người dùng hiện tại.
   *
   * @param user Người dùng hiện tại.
   * @returns Số lượng thông báo chưa đọc.
   */
  async countUnread(user: AuthenticatedUser) {
    const count = await this.notificationsRepository.countUnreadByUserId(
      user.userId,
    );
    return { unreadCount: count };
  }

  /**
   * Đánh dấu một thông báo của người dùng là đã đọc.
   *
   * @param notificationId ID thông báo.
   * @param user Người dùng hiện tại.
   * @throws NotFoundException nếu thông báo không thuộc người dùng.
   */
  async markAsRead(notificationId: number, user: AuthenticatedUser) {
    const notification = await this.notificationsRepository.findByIdAndUserId(
      notificationId,
      user.userId,
    );
    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo.');
    }

    if (notification.isread) {
      return {
        message: 'Thông báo đã được đọc.',
        data: this.mapNotification(notification),
      };
    }

    const updated =
      await this.notificationsRepository.markAsRead(notificationId);
    return {
      message: 'Đã đánh dấu thông báo là đã đọc.',
      data: this.mapNotification(updated),
    };
  }

  /**
   * Đánh dấu tất cả thông báo của người dùng là đã đọc.
   *
   * @param user Người dùng hiện tại.
   * @returns Số thông báo được cập nhật.
   */
  async markAllAsRead(user: AuthenticatedUser) {
    const result = await this.notificationsRepository.markAllAsRead(
      user.userId,
    );
    return {
      message: 'Đã đánh dấu tất cả thông báo là đã đọc.',
      updatedCount: result.count,
    };
  }

  private mapNotification(notification: {
    notificationid: number;
    title: string | null;
    content: string | null;
    type: string | null;
    isread: boolean | null;
    createddate: Date | null;
  }) {
    return {
      notificationId: notification.notificationid,
      title: notification.title,
      content: notification.content,
      type: notification.type,
      isRead: notification.isread ?? false,
      createdDate: notification.createddate,
    };
  }
}
