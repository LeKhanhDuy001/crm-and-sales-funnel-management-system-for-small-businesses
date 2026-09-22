import { Test, TestingModule } from '@nestjs/testing';

import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Role } from '../common/enums/role.enum';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomersController', () => {
  let controller: CustomersController;

  const customersServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
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
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: customersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('roles', () => {
    it('findAll cho phép Sales, Customer Care và Sales Manager', () => {
      const metadataValues = Reflect.getMetadataKeys(
        CustomersController.prototype.findAll,
      ).map((key) =>
        Reflect.getMetadata(
          key,
          CustomersController.prototype.findAll,
        ),
      );

      expect(metadataValues).toContainEqual([
        Role.SALES,
        Role.CUSTOMER_CARE,
        Role.SALES_MANAGER,
      ]);
    });

    it('findOne chỉ cho phép Sales và Customer Care', () => {
      const metadataValues = Reflect.getMetadataKeys(
        CustomersController.prototype.findOne,
      ).map((key) =>
        Reflect.getMetadata(
          key,
          CustomersController.prototype.findOne,
        ),
      );

      expect(metadataValues).toContainEqual([
        Role.SALES,
        Role.CUSTOMER_CARE,
      ]);
    });

    it('update chỉ cho phép Sales và Customer Care', () => {
      const metadataValues = Reflect.getMetadataKeys(
        CustomersController.prototype.update,
      ).map((key) =>
        Reflect.getMetadata(
          key,
          CustomersController.prototype.update,
        ),
      );

      expect(metadataValues).toContainEqual([
        Role.SALES,
        Role.CUSTOMER_CARE,
      ]);
    });
  });

  describe('findAll', () => {
    it('gọi service findAll với query và người dùng hiện tại', async () => {
      const query = {} as CustomerQueryDto;
      const expectedResult = {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      };

      customersServiceMock.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query, request);

      expect(customersServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(customersServiceMock.findAll).toHaveBeenCalledWith(
        query,
        request.user,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('gọi service findOne với customerId và người dùng hiện tại', async () => {
      const expectedResult = {
        customerId: 10,
      };

      customersServiceMock.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(10, request);

      expect(customersServiceMock.findOne).toHaveBeenCalledTimes(1);
      expect(customersServiceMock.findOne).toHaveBeenCalledWith(
        10,
        request.user,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('gọi service update với id, dto, người dùng và IP', async () => {
      const dto = {} as UpdateCustomerDto;
      const expectedResult = {
        customerId: 10,
      };

      customersServiceMock.update.mockResolvedValue(expectedResult);

      const result = await controller.update(10, dto, request);

      expect(customersServiceMock.update).toHaveBeenCalledTimes(1);
      expect(customersServiceMock.update).toHaveBeenCalledWith(
        10,
        dto,
        request.user,
        request.ip,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});