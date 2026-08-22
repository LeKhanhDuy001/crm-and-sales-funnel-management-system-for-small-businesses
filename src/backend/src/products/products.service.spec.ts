import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import type { CreateProductDto } from './dto/create-product.dto';
import type { ProductQueryDto } from './dto/product-query.dto';
import type { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './repositories/products.repository';
import { ProductsService } from './products.service';

type ProductsRepositoryMock = {
  findMany: jest.Mock;
  count: jest.Mock;
  findCategories: jest.Mock;
  findById: jest.Mock;
  findByName: jest.Mock;
  findByNameExceptId: jest.Mock;
  countQuoteDetails: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  deactivate: jest.Mock;
  delete: jest.Mock;
};

describe('ProductsService - Admin quản lý sản phẩm', () => {
  let productsService: ProductsService;
  let productsRepository: ProductsRepositoryMock;
  const adminUser = {
    userId: 1,
    email: 'admin@crm.com',
    role: 'Admin',
  } as unknown as AuthenticatedUser;

  const product = {
    productid: 7,
    productname: 'CRM Basic',
    category: 'Phần mềm',
    price: 150000,
    description: 'Gói CRM cơ bản',
    status: true,
  };

  beforeEach(() => {
    productsRepository = {
      findMany: jest.fn(),
      count: jest.fn(),
      findCategories: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findByNameExceptId: jest.fn(),
      countQuoteDetails: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deactivate: jest.fn(),
      delete: jest.fn(),
    };

    productsService = new ProductsService(
      productsRepository as unknown as ProductsRepository,
    );
  });

  describe('findAll', () => {
    it('trả danh sách sản phẩm theo bộ lọc và phân trang', async () => {
      productsRepository.findMany.mockResolvedValue([product]);
      productsRepository.count.mockResolvedValue(1);
      const query = {
        search: '  CRM  ',
        category: '  Phần mềm  ',
        status: true,
        page: 2,
        limit: 10,
      } as ProductQueryDto;

      const result = await productsService.findAll(query);

      expect(productsRepository.findMany).toHaveBeenCalledWith({
        search: 'CRM',
        category: 'Phần mềm',
        status: true,
        skip: 10,
        take: 10,
      });
      expect(productsRepository.count).toHaveBeenCalledWith({
        search: 'CRM',
        category: 'Phần mềm',
        status: true,
      });
      expect(result.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
      expect(result.data[0]).toEqual({
        productId: 7,
        productCode: 'SP007',
        productName: 'CRM Basic',
        category: 'Phần mềm',
        price: 150000,
        description: 'Gói CRM cơ bản',
        status: true,
      });
    });
  });

  describe('findCategories', () => {
    it('trả danh sách danh mục sản phẩm', async () => {
      productsRepository.findCategories.mockResolvedValue([
        'Dịch vụ',
        'Phần mềm',
      ]);
      const result = await productsService.findCategories();
      expect(result).toEqual({
        data: ['Dịch vụ', 'Phần mềm'],
      });
    });
  });

  describe('findOne', () => {
    it('trả chi tiết sản phẩm khi sản phẩm tồn tại', async () => {
      productsRepository.findById.mockResolvedValue(product);
      const result = await productsService.findOne(7);
      expect(productsRepository.findById).toHaveBeenCalledWith(7);
      expect(result.productId).toBe(7);
      expect(result.productCode).toBe('SP007');
      expect(result.productName).toBe('CRM Basic');
    });

    it('ném NotFoundException khi sản phẩm không tồn tại', async () => {
      productsRepository.findById.mockResolvedValue(null);
      await expect(productsService.findOne(999)).rejects.toThrow(
        new NotFoundException('Không tìm thấy sản phẩm.'),
      );
    });
  });

  describe('create', () => {
    it('tạo sản phẩm hợp lệ và chuẩn hóa dữ liệu trước khi lưu', async () => {
      productsRepository.findByName.mockResolvedValue(null);
      productsRepository.create.mockResolvedValue(product);
      const dto = {
        productName: '  CRM Basic  ',
        category: '  Phần mềm  ',
        price: 150000,
        description: '  Gói CRM cơ bản  ',
        status: true,
      } as CreateProductDto;
      const result = await productsService.create(dto, adminUser);
      expect(productsRepository.findByName).toHaveBeenCalledWith('CRM Basic');
      expect(productsRepository.create).toHaveBeenCalledWith(
        {
          productname: 'CRM Basic',
          category: 'Phần mềm',
          price: 150000,
          description: 'Gói CRM cơ bản',
          status: true,
        },
        1,
      );

      expect(result.message).toBe('Thêm sản phẩm thành công.');
      expect(result.product.productCode).toBe('SP007');
    });

    it('từ chối tạo sản phẩm khi tên đã tồn tại', async () => {
      productsRepository.findByName.mockResolvedValue(product);
      const dto = {
        productName: 'CRM Basic',
        price: 150000,
      } as CreateProductDto;
      await expect(productsService.create(dto, adminUser)).rejects.toThrow(
        new ConflictException('Tên sản phẩm đã tồn tại.'),
      );
      expect(productsRepository.create).not.toHaveBeenCalled();
    });

    it.each([0, -1, -100])(
      'BR-17 - từ chối tạo sản phẩm khi giá = %s',
      async (price) => {
        productsRepository.findByName.mockResolvedValue(null);
        const dto = {
          productName: 'CRM New',
          price,
        } as CreateProductDto;
        await expect(productsService.create(dto, adminUser)).rejects.toThrow(
          new UnprocessableEntityException('Giá sản phẩm phải lớn hơn 0.'),
        );
        expect(productsRepository.create).not.toHaveBeenCalled();
      },
    );
  });

  describe('update', () => {
    it('cập nhật sản phẩm hợp lệ', async () => {
      productsRepository.findById.mockResolvedValue(product);
      productsRepository.findByNameExceptId.mockResolvedValue(null);
      const updatedProduct = {
        ...product,
        productname: 'CRM Premium',
        category: 'Dịch vụ',
        price: 300000,
        description: 'Gói Premium',
        status: false,
      };
      productsRepository.update.mockResolvedValue(updatedProduct);
      const dto = {
        productName: '  CRM Premium  ',
        category: '  Dịch vụ  ',
        price: 300000,
        description: '  Gói Premium  ',
        status: false,
      } as UpdateProductDto;
      const result = await productsService.update(7, dto, adminUser);
      expect(productsRepository.findByNameExceptId).toHaveBeenCalledWith(
        'CRM Premium',
        7,
      );
      expect(productsRepository.update).toHaveBeenCalledWith(
        7,
        {
          productname: 'CRM Premium',
          category: 'Dịch vụ',
          price: 300000,
          description: 'Gói Premium',
          status: false,
        },
        1,
        product,
      );

      expect(result.message).toBe('Cập nhật sản phẩm thành công.');
      expect(result.product.productName).toBe('CRM Premium');
    });

    it('ném NotFoundException khi cập nhật sản phẩm không tồn tại', async () => {
      productsRepository.findById.mockResolvedValue(null);
      await expect(
        productsService.update(999, { productName: 'CRM Premium' }, adminUser),
      ).rejects.toThrow(new NotFoundException('Không tìm thấy sản phẩm.'));
      expect(productsRepository.update).not.toHaveBeenCalled();
    });

    it('từ chối cập nhật khi tên mới bị trùng', async () => {
      productsRepository.findById.mockResolvedValue(product);
      productsRepository.findByNameExceptId.mockResolvedValue({ productid: 8 });
      await expect(
        productsService.update(7, { productName: 'CRM Enterprise' }, adminUser),
      ).rejects.toThrow(new ConflictException('Tên sản phẩm đã tồn tại.'));
      expect(productsRepository.update).not.toHaveBeenCalled();
    });
    it('từ chối cập nhật khi tên sản phẩm chỉ chứa khoảng trắng', async () => {
      productsRepository.findById.mockResolvedValue(product);
      await expect(
        productsService.update(7, { productName: '   ' }, adminUser),
      ).rejects.toThrow(
        new UnprocessableEntityException('Tên sản phẩm không được để trống.'),
      );

      expect(productsRepository.update).not.toHaveBeenCalled();
    });

    it.each([0, -1, -100])(
      'BR-17 - từ chối cập nhật khi giá = %s',
      async (price) => {
        productsRepository.findById.mockResolvedValue(product);
        await expect(
          productsService.update(7, { price }, adminUser),
        ).rejects.toThrow(
          new UnprocessableEntityException('Giá sản phẩm phải lớn hơn 0.'),
        );
        expect(productsRepository.update).not.toHaveBeenCalled();
      },
    );

    it('không gọi Repository update khi không có dữ liệu cần cập nhật', async () => {
      productsRepository.findById.mockResolvedValue(product);
      const result = await productsService.update(7, {}, adminUser);
      expect(result.message).toBe('Không có thông tin cần cập nhật.');
      expect(result.product.productId).toBe(7);
      expect(productsRepository.update).not.toHaveBeenCalled();
    });
  });
  describe('remove', () => {
    it('BR-17, BR-20 - sản phẩm đã có QuoteDetail thì ngừng hoạt động thay vì xóa vật lý', async () => {
      productsRepository.findById.mockResolvedValue(product);
      productsRepository.countQuoteDetails.mockResolvedValue(2);
      const deactivatedProduct = {
        ...product,
        status: false,
      };
      productsRepository.deactivate.mockResolvedValue(deactivatedProduct);
      const result = await productsService.remove(7, adminUser);
      expect(productsRepository.countQuoteDetails).toHaveBeenCalledWith(7);
      expect(productsRepository.deactivate).toHaveBeenCalledWith(7, 1, product);
      expect(productsRepository.delete).not.toHaveBeenCalled();
      expect(result.mode).toBe('deactivated');
      expect(result.product).toBeDefined();
      expect(result.product!.status).toBe(false);
    });

    it('xóa vật lý sản phẩm khi chưa phát sinh QuoteDetail', async () => {
      productsRepository.findById.mockResolvedValue(product);
      productsRepository.countQuoteDetails.mockResolvedValue(0);
      productsRepository.delete.mockResolvedValue(undefined);
      const result = await productsService.remove(7, adminUser);
      expect(productsRepository.delete).toHaveBeenCalledWith(7, 1, product);
      expect(productsRepository.deactivate).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Xóa sản phẩm thành công.',
        mode: 'deleted',
        productId: 7,
      });
    });
    it('ném NotFoundException khi xóa sản phẩm không tồn tại', async () => {
      productsRepository.findById.mockResolvedValue(null);
      await expect(productsService.remove(999, adminUser)).rejects.toThrow(
        new NotFoundException('Không tìm thấy sản phẩm.'),
      );
      expect(productsRepository.countQuoteDetails).not.toHaveBeenCalled();
      expect(productsRepository.delete).not.toHaveBeenCalled();
      expect(productsRepository.deactivate).not.toHaveBeenCalled();
    });
  });
});
