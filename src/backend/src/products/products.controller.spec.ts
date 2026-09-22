import { Test, TestingModule } from '@nestjs/testing';

import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Role } from '../common/enums/role.enum';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;

  const productsServiceMock = {
    findAll: jest.fn(),
    findCategories: jest.fn(),
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
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: productsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('chỉ cho phép Admin truy cập Products', () => {
    const metadataValues: unknown[] = Reflect.getMetadataKeys(
      ProductsController,
    ).map(
      (key): unknown => Reflect.getMetadata(key, ProductsController) as unknown,
    );

    expect(metadataValues).toContainEqual([Role.ADMIN]);
  });

  describe('findAll', () => {
    it('gọi service findAll với query', async () => {
      const query = {
        page: 1,
        limit: 20,
      } as ProductQueryDto;

      const expectedResult = {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      };

      productsServiceMock.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(productsServiceMock.findAll).toHaveBeenCalledTimes(1);

      expect(productsServiceMock.findAll).toHaveBeenCalledWith(query);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findCategories', () => {
    it('gọi service findCategories', async () => {
      const expectedResult = ['Software', 'Service'];

      productsServiceMock.findCategories.mockResolvedValue(expectedResult);

      const result = await controller.findCategories();

      expect(productsServiceMock.findCategories).toHaveBeenCalledTimes(1);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('gọi service findOne với productId', async () => {
      const expectedResult = {
        productId: 10,
        productName: 'CRM Package',
      };

      productsServiceMock.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(10);

      expect(productsServiceMock.findOne).toHaveBeenCalledTimes(1);

      expect(productsServiceMock.findOne).toHaveBeenCalledWith(10);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('gọi service create với dto và Admin hiện tại', async () => {
      const dto = {
        productName: 'CRM Package',
      } as CreateProductDto;

      const expectedResult = {
        productId: 10,
      };

      productsServiceMock.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto, request);

      expect(productsServiceMock.create).toHaveBeenCalledTimes(1);

      expect(productsServiceMock.create).toHaveBeenCalledWith(
        dto,
        request.user,
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('gọi service update với productId, dto và Admin hiện tại', async () => {
      const dto = {
        productName: 'CRM Package Updated',
      } as UpdateProductDto;

      const expectedResult = {
        productId: 10,
      };

      productsServiceMock.update.mockResolvedValue(expectedResult);

      const result = await controller.update(10, dto, request);

      expect(productsServiceMock.update).toHaveBeenCalledTimes(1);

      expect(productsServiceMock.update).toHaveBeenCalledWith(
        10,
        dto,
        request.user,
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('gọi service remove với productId và Admin hiện tại', async () => {
      const expectedResult = {
        productId: 10,
        active: false,
      };

      productsServiceMock.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(10, request);

      expect(productsServiceMock.remove).toHaveBeenCalledTimes(1);

      expect(productsServiceMock.remove).toHaveBeenCalledWith(10, request.user);

      expect(result).toEqual(expectedResult);
    });
  });
});
