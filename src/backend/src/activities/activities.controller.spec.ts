import { Test, TestingModule } from '@nestjs/testing';

import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Role } from '../common/enums/role.enum';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';

describe('ActivitiesController', () => {
  let controller: ActivitiesController;

  const activitiesServiceMock = {
    findAll: jest.fn(),
    getMeta: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    updateResult: jest.fn(),
    cancel: jest.fn(),
  };

  const request = {
    user: {
      userId: 7,
      role: Role.SALES,
    },
    ip: '127.0.0.1',
  } as unknown as AuthenticatedRequest;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        {
          provide: ActivitiesService,
          useValue: activitiesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('chỉ cho phép Sales và Customer Care truy cập Activities', () => {
    const metadataValues: unknown[] = Reflect.getMetadataKeys(
      ActivitiesController,
    ).map(
      (key): unknown =>
        Reflect.getMetadata(key, ActivitiesController) as unknown,
    );

    expect(metadataValues).toContainEqual([Role.SALES, Role.CUSTOMER_CARE]);
  });

  describe('findAll', () => {
    it('gọi service findAll với người dùng hiện tại', async () => {
      const expectedResult = {
        data: [],
      };

      activitiesServiceMock.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(request);

      expect(activitiesServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(activitiesServiceMock.findAll).toHaveBeenCalledWith(request.user);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getMeta', () => {
    it('gọi service getMeta với người dùng hiện tại', async () => {
      const expectedResult = {
        deals: [],
      };

      activitiesServiceMock.getMeta.mockResolvedValue(expectedResult);

      const result = await controller.getMeta(request);

      expect(activitiesServiceMock.getMeta).toHaveBeenCalledTimes(1);
      expect(activitiesServiceMock.getMeta).toHaveBeenCalledWith(request.user);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('gọi service findOne với activityId và người dùng hiện tại', async () => {
      const expectedResult = {
        activityId: 10,
      };

      activitiesServiceMock.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(10, request);

      expect(activitiesServiceMock.findOne).toHaveBeenCalledTimes(1);
      expect(activitiesServiceMock.findOne).toHaveBeenCalledWith(
        10,
        request.user,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('gọi service create với dto, người dùng và địa chỉ IP', async () => {
      const dto = {
        dealId: 3,
        activityType: 'Call',
        subject: 'Gọi chăm sóc khách hàng',
        description: 'Trao đổi nhu cầu của khách hàng',
        activityTime: '2026-09-22T10:00:00.000Z',
      } as CreateActivityDto;

      const expectedResult = {
        activityId: 11,
      };

      activitiesServiceMock.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto, request);

      expect(activitiesServiceMock.create).toHaveBeenCalledTimes(1);
      expect(activitiesServiceMock.create).toHaveBeenCalledWith(
        dto,
        request.user,
        request.ip,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateResult', () => {
    it('gọi service updateResult với id, dto, người dùng và IP', async () => {
      const dto = {
        result: 'Khách hàng đồng ý liên hệ lại.',
      };

      const expectedResult = {
        activityId: 10,
        result: dto.result,
      };

      activitiesServiceMock.updateResult.mockResolvedValue(expectedResult);

      const result = await controller.updateResult(10, dto, request);

      expect(activitiesServiceMock.updateResult).toHaveBeenCalledTimes(1);

      expect(activitiesServiceMock.updateResult).toHaveBeenCalledWith(
        10,
        dto,
        request.user,
        request.ip,
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('cancel', () => {
    it('gọi service cancel với id, người dùng và IP', async () => {
      const expectedResult = {
        activityId: 10,
        status: 'Cancelled',
      };

      activitiesServiceMock.cancel.mockResolvedValue(expectedResult);

      const result = await controller.cancel(10, request);

      expect(activitiesServiceMock.cancel).toHaveBeenCalledTimes(1);
      expect(activitiesServiceMock.cancel).toHaveBeenCalledWith(
        10,
        request.user,
        request.ip,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
