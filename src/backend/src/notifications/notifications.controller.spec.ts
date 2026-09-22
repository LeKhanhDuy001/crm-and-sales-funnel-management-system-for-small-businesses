import { Test, TestingModule } from '@nestjs/testing';

import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Role } from '../common/enums/role.enum';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  const notificationsServiceMock = {
    findMyNotifications: jest.fn(),
    countUnread: jest.fn(),
    markAllAsRead: jest.fn(),
    markAsRead: jest.fn(),
  };

  const request = {
    user: {
      userId: 7,
      role: Role.SALES,
    },
  } as unknown as AuthenticatedRequest;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: notificationsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(
      NotificationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('chỉ cho phép Sales và Customer Care truy cập Notifications', () => {
    const metadataValues = Reflect.getMetadataKeys(
      NotificationsController,
    ).map((key) =>
      Reflect.getMetadata(
        key,
        NotificationsController,
      ),
    );

    expect(metadataValues).toContainEqual([
      Role.SALES,
      Role.CUSTOMER_CARE,
    ]);
  });

  describe('findMyNotifications', () => {
    it('gọi service với người dùng hiện tại', async () => {
      const expectedResult = {
        data: [],
      };

      notificationsServiceMock.findMyNotifications.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.findMyNotifications(request);

      expect(
        notificationsServiceMock.findMyNotifications,
      ).toHaveBeenCalledTimes(1);

      expect(
        notificationsServiceMock.findMyNotifications,
      ).toHaveBeenCalledWith(request.user);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('countUnread', () => {
    it('gọi service countUnread với người dùng hiện tại', async () => {
      const expectedResult = {
        unreadCount: 3,
      };

      notificationsServiceMock.countUnread.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.countUnread(request);

      expect(
        notificationsServiceMock.countUnread,
      ).toHaveBeenCalledTimes(1);

      expect(
        notificationsServiceMock.countUnread,
      ).toHaveBeenCalledWith(request.user);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('markAllAsRead', () => {
    it('gọi service markAllAsRead với người dùng hiện tại', async () => {
      const expectedResult = {
        updatedCount: 3,
      };

      notificationsServiceMock.markAllAsRead.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.markAllAsRead(request);

      expect(
        notificationsServiceMock.markAllAsRead,
      ).toHaveBeenCalledTimes(1);

      expect(
        notificationsServiceMock.markAllAsRead,
      ).toHaveBeenCalledWith(request.user);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('markAsRead', () => {
    it('gọi service với notificationId và người dùng hiện tại', async () => {
      const expectedResult = {
        notificationId: 10,
        isRead: true,
      };

      notificationsServiceMock.markAsRead.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.markAsRead(
        10,
        request,
      );

      expect(
        notificationsServiceMock.markAsRead,
      ).toHaveBeenCalledTimes(1);

      expect(
        notificationsServiceMock.markAsRead,
      ).toHaveBeenCalledWith(
        10,
        request.user,
      );

      expect(result).toEqual(expectedResult);
    });
  });
});