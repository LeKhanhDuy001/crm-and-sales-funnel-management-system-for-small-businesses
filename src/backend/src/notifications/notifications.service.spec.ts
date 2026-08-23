import { NotFoundException } from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Role } from '../common/enums/role.enum';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './repositories/notifications.repository';

type NotificationRecord = NonNullable<
  Awaited<ReturnType<NotificationsRepository['findByIdAndUserId']>>
>;
type NotificationsRepositoryMock = {
  findManyByUserId: jest.MockedFunction<
    NotificationsRepository['findManyByUserId']
  >;
  countUnreadByUserId: jest.MockedFunction<
    NotificationsRepository['countUnreadByUserId']
  >;
  findByIdAndUserId: jest.MockedFunction<
    NotificationsRepository['findByIdAndUserId']
  >;
  markAsRead: jest.MockedFunction<NotificationsRepository['markAsRead']>;
  markAllAsRead: jest.MockedFunction<NotificationsRepository['markAllAsRead']>;
};

function makeNotification(
  overrides: Partial<NotificationRecord> = {},
): NotificationRecord {
  return {
    notificationid: 1,
    userid: 2,
    title: 'Bạn có công việc mới',
    content: 'Bạn được giao Task "Gọi khách hàng".',
    type: 'Task',
    isread: false,
    createddate: new Date('2026-08-23T10:00:00.000Z'),
    ...overrides,
  };
}
describe('NotificationsService', () => {
  let notificationsService: NotificationsService;
  let notificationsRepository: NotificationsRepositoryMock;
  const salesUser: AuthenticatedUser = {
    userId: 2,
    fullName: 'Sales Demo',
    email: 'sales@crm.local',
    role: Role.SALES,
  };
  beforeEach(() => {
    notificationsRepository = {
      findManyByUserId: jest.fn(),
      countUnreadByUserId: jest.fn(),
      findByIdAndUserId: jest.fn(),
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
    };
    notificationsService = new NotificationsService(
      notificationsRepository as unknown as NotificationsRepository,
    );
  });

  describe('findMyNotifications', () => {
    it('chỉ lấy danh sách thông báo của người dùng đang đăng nhập', async () => {
      const notification = makeNotification();
      notificationsRepository.findManyByUserId.mockResolvedValue([
        notification,
      ]);
      const result = await notificationsService.findMyNotifications(salesUser);
      expect(notificationsRepository.findManyByUserId).toHaveBeenCalledWith(2);
      expect(result).toEqual([
        {
          notificationId: 1,
          title: 'Bạn có công việc mới',
          content: 'Bạn được giao Task "Gọi khách hàng".',
          type: 'Task',
          isRead: false,
          createdDate: new Date('2026-08-23T10:00:00.000Z'),
        },
      ]);
    });
    it('trả danh sách rỗng khi người dùng chưa có thông báo', async () => {
      notificationsRepository.findManyByUserId.mockResolvedValue([]);
      const result = await notificationsService.findMyNotifications(salesUser);
      expect(result).toEqual([]);
    });
  });
  describe('countUnread', () => {
    it('đếm đúng số thông báo chưa đọc của người dùng hiện tại', async () => {
      notificationsRepository.countUnreadByUserId.mockResolvedValue(3);
      const result = await notificationsService.countUnread(salesUser);
      expect(notificationsRepository.countUnreadByUserId).toHaveBeenCalledWith(
        2,
      );
      expect(result).toEqual({ unreadCount: 3 });
    });
  });

  describe('markAsRead', () => {
    it('ném NotFoundException khi thông báo không tồn tại hoặc không thuộc người dùng', async () => {
      notificationsRepository.findByIdAndUserId.mockResolvedValue(null);
      await expect(
        notificationsService.markAsRead(99, salesUser),
      ).rejects.toThrow(NotFoundException);
      expect(notificationsRepository.findByIdAndUserId).toHaveBeenCalledWith(
        99,
        2,
      );
      expect(notificationsRepository.markAsRead).not.toHaveBeenCalled();
    });
    it('không cập nhật lại thông báo đã được đọc', async () => {
      const notification = makeNotification({ isread: true });
      notificationsRepository.findByIdAndUserId.mockResolvedValue(notification);
      const result = await notificationsService.markAsRead(1, salesUser);
      expect(notificationsRepository.markAsRead).not.toHaveBeenCalled();
      expect(result.message).toBe('Thông báo đã được đọc.');
      expect(result.data.isRead).toBe(true);
    });
    it('đánh dấu thông báo chưa đọc thành đã đọc', async () => {
      const currentNotification = makeNotification({ isread: false });
      const updatedNotification = makeNotification({ isread: true });
      notificationsRepository.findByIdAndUserId.mockResolvedValue(
        currentNotification,
      );
      notificationsRepository.markAsRead.mockResolvedValue(updatedNotification);
      const result = await notificationsService.markAsRead(1, salesUser);
      expect(notificationsRepository.findByIdAndUserId).toHaveBeenCalledWith(
        1,
        2,
      );
      expect(notificationsRepository.markAsRead).toHaveBeenCalledWith(1);
      expect(result.message).toBe('Đã đánh dấu thông báo là đã đọc.');
      expect(result.data.isRead).toBe(true);
    });
  });

  describe('markAllAsRead', () => {
    it('đánh dấu tất cả thông báo chưa đọc của người dùng thành đã đọc', async () => {
      notificationsRepository.markAllAsRead.mockResolvedValue({ count: 4 });
      const result = await notificationsService.markAllAsRead(salesUser);
      expect(notificationsRepository.markAllAsRead).toHaveBeenCalledWith(2);
      expect(result).toEqual({
        message: 'Đã đánh dấu tất cả thông báo là đã đọc.',
        updatedCount: 4,
      });
    });
    it('trả updatedCount = 0 khi không còn thông báo chưa đọc', async () => {
      notificationsRepository.markAllAsRead.mockResolvedValue({ count: 0 });
      const result = await notificationsService.markAllAsRead(salesUser);
      expect(result).toEqual({
        message: 'Đã đánh dấu tất cả thông báo là đã đọc.',
        updatedCount: 0,
      });
    });
  });
});
