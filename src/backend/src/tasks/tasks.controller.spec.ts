import { Test, TestingModule } from '@nestjs/testing';

import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Role } from '../common/enums/role.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;

  const tasksServiceMock = {
    findAll: jest.fn(),
    getMeta: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
    cancel: jest.fn(),
    assign: jest.fn(),
    update: jest.fn(),
  };

  const request = {
    user: {
      userId: 7,
      role: Role.SALES_MANAGER,
    },
    ip: '127.0.0.1',
  } as unknown as AuthenticatedRequest;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: tasksServiceMock,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('roles', () => {
    it('findAll cho phép Sales Manager, Sales và Customer Care', () => {
      expect(
        getMethodMetadataValues(TasksController.prototype, 'findAll'),
      ).toContainEqual([Role.SALES_MANAGER, Role.SALES, Role.CUSTOMER_CARE]);
    });

    it('getMeta chỉ cho phép Sales Manager và Customer Care', () => {
      expect(
        getMethodMetadataValues(TasksController.prototype, 'getMeta'),
      ).toContainEqual([Role.SALES_MANAGER, Role.CUSTOMER_CARE]);
    });

    it('findOne cho phép Sales Manager, Sales và Customer Care', () => {
      expect(
        getMethodMetadataValues(TasksController.prototype, 'findOne'),
      ).toContainEqual([Role.SALES_MANAGER, Role.SALES, Role.CUSTOMER_CARE]);
    });

    it('create chỉ cho phép Sales Manager và Customer Care', () => {
      expect(
        getMethodMetadataValues(TasksController.prototype, 'create'),
      ).toContainEqual([Role.SALES_MANAGER, Role.CUSTOMER_CARE]);
    });

    it('updateStatus chỉ cho phép Sales Manager và Customer Care', () => {
      expect(
        getMethodMetadataValues(TasksController.prototype, 'updateStatus'),
      ).toContainEqual([Role.SALES_MANAGER, Role.CUSTOMER_CARE]);
    });

    it('cancel chỉ cho phép Sales Manager và Customer Care', () => {
      expect(
        getMethodMetadataValues(TasksController.prototype, 'cancel'),
      ).toContainEqual([Role.SALES_MANAGER, Role.CUSTOMER_CARE]);
    });

    it('assign chỉ cho phép Sales Manager', () => {
      expect(
        getMethodMetadataValues(TasksController.prototype, 'assign'),
      ).toContainEqual([Role.SALES_MANAGER]);
    });

    it('update chỉ cho phép Sales Manager và Customer Care', () => {
      expect(
        getMethodMetadataValues(TasksController.prototype, 'update'),
      ).toContainEqual([Role.SALES_MANAGER, Role.CUSTOMER_CARE]);
    });
  });

  describe('findAll', () => {
    it('gọi service findAll với query và người dùng hiện tại', async () => {
      const query = {} as TaskQueryDto;

      const expectedResult = {
        data: [],
      };

      tasksServiceMock.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query, request);

      expect(tasksServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(tasksServiceMock.findAll).toHaveBeenCalledWith(
        query,
        request.user,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getMeta', () => {
    it('gọi service getMeta với người dùng hiện tại', async () => {
      const expectedResult = {
        users: [],
      };

      tasksServiceMock.getMeta.mockResolvedValue(expectedResult);

      const result = await controller.getMeta(request);

      expect(tasksServiceMock.getMeta).toHaveBeenCalledTimes(1);
      expect(tasksServiceMock.getMeta).toHaveBeenCalledWith(request.user);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('gọi service findOne với taskId và người dùng hiện tại', async () => {
      const expectedResult = {
        taskId: 10,
      };

      tasksServiceMock.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(10, request);

      expect(tasksServiceMock.findOne).toHaveBeenCalledTimes(1);
      expect(tasksServiceMock.findOne).toHaveBeenCalledWith(10, request.user);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('gọi service create với dto, người dùng và IP', async () => {
      const dto = {} as CreateTaskDto;

      const expectedResult = {
        taskId: 10,
      };

      tasksServiceMock.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto, request);

      expect(tasksServiceMock.create).toHaveBeenCalledTimes(1);
      expect(tasksServiceMock.create).toHaveBeenCalledWith(
        dto,
        request.user,
        request.ip,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateStatus', () => {
    it('gọi service updateStatus với taskId, dto, người dùng và IP', async () => {
      const dto = {} as UpdateTaskStatusDto;

      const expectedResult = {
        taskId: 10,
      };

      tasksServiceMock.updateStatus.mockResolvedValue(expectedResult);

      const result = await controller.updateStatus(10, dto, request);

      expect(tasksServiceMock.updateStatus).toHaveBeenCalledTimes(1);

      expect(tasksServiceMock.updateStatus).toHaveBeenCalledWith(
        10,
        dto,
        request.user,
        request.ip,
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('cancel', () => {
    it('gọi service cancel với taskId, người dùng và IP', async () => {
      const expectedResult = {
        taskId: 10,
        status: 'Cancelled',
      };

      tasksServiceMock.cancel.mockResolvedValue(expectedResult);

      const result = await controller.cancel(10, request);

      expect(tasksServiceMock.cancel).toHaveBeenCalledTimes(1);
      expect(tasksServiceMock.cancel).toHaveBeenCalledWith(
        10,
        request.user,
        request.ip,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('assign', () => {
    it('gọi service assign với taskId, dto, người dùng và IP', async () => {
      const dto = {
        assignedUserId: 8,
      };

      const expectedResult = {
        taskId: 10,
        assignedUserId: 8,
      };

      tasksServiceMock.assign.mockResolvedValue(expectedResult);

      const result = await controller.assign(10, dto, request);

      expect(tasksServiceMock.assign).toHaveBeenCalledTimes(1);
      expect(tasksServiceMock.assign).toHaveBeenCalledWith(
        10,
        dto,
        request.user,
        request.ip,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('gọi service update với taskId, dto, người dùng và IP', async () => {
      const dto = {} as UpdateTaskDto;

      const expectedResult = {
        taskId: 10,
      };

      tasksServiceMock.update.mockResolvedValue(expectedResult);

      const result = await controller.update(10, dto, request);

      expect(tasksServiceMock.update).toHaveBeenCalledTimes(1);
      expect(tasksServiceMock.update).toHaveBeenCalledWith(
        10,
        dto,
        request.user,
        request.ip,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});

function getMethodMetadataValues(
  prototype: object,
  methodName: string,
): unknown[] {
  const method = Object.getOwnPropertyDescriptor(prototype, methodName)
    ?.value as unknown;

  if (typeof method !== 'function') {
    throw new Error(`Không tìm thấy method ${methodName}.`);
  }

  const metadataKeys = Reflect.getMetadataKeys(method) as unknown[];

  return metadataKeys.map(
    (key): unknown => Reflect.getMetadata(key, method) as unknown,
  );
}
