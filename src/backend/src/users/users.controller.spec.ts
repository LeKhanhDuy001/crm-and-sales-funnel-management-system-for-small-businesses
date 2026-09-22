import { Test, TestingModule } from '@nestjs/testing';

import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Role } from '../common/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const usersServiceMock = {
    findAll: jest.fn(),
    findRoles: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const request = {
    user: {
      userId: 1,
      role: Role.ADMIN,
    },
  } as unknown as AuthenticatedRequest;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('roles', () => {
    it('findAll chỉ cho phép Admin', () => {
      expect(getRoleMetadata(controller.findAll)).toContainEqual([
        Role.ADMIN,
      ]);
    });

    it('findRoles chỉ cho phép Admin', () => {
      expect(getRoleMetadata(controller.findRoles)).toContainEqual([
        Role.ADMIN,
      ]);
    });

    it('findOne chỉ cho phép Admin', () => {
      expect(getRoleMetadata(controller.findOne)).toContainEqual([
        Role.ADMIN,
      ]);
    });

    it('create chỉ cho phép Admin', () => {
      expect(getRoleMetadata(controller.create)).toContainEqual([
        Role.ADMIN,
      ]);
    });

    it('update chỉ cho phép Admin', () => {
      expect(getRoleMetadata(controller.update)).toContainEqual([
        Role.ADMIN,
      ]);
    });

    it('remove chỉ cho phép Admin', () => {
      expect(getRoleMetadata(controller.remove)).toContainEqual([
        Role.ADMIN,
      ]);
    });
  });

  describe('findAll', () => {
    it('gọi service findAll với query', async () => {
      const query = {
        page: 1,
        limit: 20,
      } as UserQueryDto;

      const expectedResult = {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      };

      usersServiceMock.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(usersServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findRoles', () => {
    it('gọi service findRoles', async () => {
      const expectedResult = [
        {
          roleId: 1,
          roleName: 'Admin',
        },
      ];

      usersServiceMock.findRoles.mockResolvedValue(expectedResult);

      const result = await controller.findRoles();

      expect(usersServiceMock.findRoles).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('gọi service findOne với userId', async () => {
      const expectedResult = {
        userId: 10,
      };

      usersServiceMock.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(10);

      expect(usersServiceMock.findOne).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.findOne).toHaveBeenCalledWith(10);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('gọi service create với dto và Admin hiện tại', async () => {
      const dto = {} as CreateUserDto;

      const expectedResult = {
        userId: 10,
      };

      usersServiceMock.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto, request);

      expect(usersServiceMock.create).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.create).toHaveBeenCalledWith(
        dto,
        request.user,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('gọi service update với userId, dto và Admin hiện tại', async () => {
      const dto = {} as UpdateUserDto;

      const expectedResult = {
        userId: 10,
      };

      usersServiceMock.update.mockResolvedValue(expectedResult);

      const result = await controller.update(
        10,
        dto,
        request,
      );

      expect(usersServiceMock.update).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.update).toHaveBeenCalledWith(
        10,
        dto,
        request.user,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('gọi service remove với userId và Admin hiện tại', async () => {
      const expectedResult = {
        userId: 10,
      };

      usersServiceMock.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(
        10,
        request,
      );

      expect(usersServiceMock.remove).toHaveBeenCalledTimes(1);
      expect(usersServiceMock.remove).toHaveBeenCalledWith(
        10,
        request.user,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});

function getRoleMetadata(
  handler: (...args: never[]) => unknown,
): unknown[] {
  return Reflect.getMetadataKeys(handler).map((key) =>
    Reflect.getMetadata(key, handler),
  );
}