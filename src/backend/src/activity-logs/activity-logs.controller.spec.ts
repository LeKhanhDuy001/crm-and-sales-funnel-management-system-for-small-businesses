import { Test, TestingModule } from '@nestjs/testing';

import { Role } from '../common/enums/role.enum';
import { ActivityLogsController } from './activity-logs.controller';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLogQueryDto } from './dto/activity-log-query.dto';

describe('ActivityLogsController', () => {
  let controller: ActivityLogsController;

  const activityLogsServiceMock = {
    findAll: jest.fn(),
    findFilterUsers: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityLogsController],
      providers: [
        {
          provide: ActivityLogsService,
          useValue: activityLogsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ActivityLogsController>(ActivityLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('chỉ cho phép role Admin truy cập Activity Log', () => {
    const metadataValues: unknown[] = Reflect.getMetadataKeys(
      ActivityLogsController,
    ).map(
      (key): unknown =>
        Reflect.getMetadata(key, ActivityLogsController) as unknown,
    );

    expect(metadataValues).toContainEqual([Role.ADMIN]);
  });

  describe('findAll', () => {
    it('gọi service findAll với query và trả về kết quả', async () => {
      const query: ActivityLogQueryDto = {
        userId: 1,
        page: 1,
        limit: 20,
      };

      const expectedResult = {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      };

      activityLogsServiceMock.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(activityLogsServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(activityLogsServiceMock.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findFilterUsers', () => {
    it('gọi service findFilterUsers và trả về kết quả', async () => {
      const expectedResult = {
        data: [
          {
            userId: 1,
            fullName: 'Admin',
          },
        ],
      };

      activityLogsServiceMock.findFilterUsers.mockResolvedValue(expectedResult);

      const result = await controller.findFilterUsers();

      expect(activityLogsServiceMock.findFilterUsers).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });
});
