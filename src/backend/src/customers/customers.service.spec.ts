import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Role } from '../common/enums/role.enum';
import type { CustomerQueryDto } from './dto/customer-query.dto';
import type { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomersRepository } from './repositories/customers.repository';
import { CustomersService } from './customers.service';

type CustomersRepositoryMock = {
  findMany: jest.Mock;
  count: jest.Mock;
  findAccessibleById: jest.Mock;
  updateWithActivityLog: jest.Mock;
  toLogValue: jest.Mock;
};

describe('CustomersService - Quản lý Customer', () => {
  let customersService: CustomersService;
  let customersRepository: CustomersRepositoryMock;
  const salesUser = {
    userId: 5,
    email: 'sales@crm.com',
    role: Role.SALES,
  } as unknown as AuthenticatedUser;
  const customerCareUser = {
    userId: 8,
    email: 'care@crm.com',
    role: Role.CUSTOMER_CARE,
  } as unknown as AuthenticatedUser;
  const customer = {
    customerid: 7,
    leadid: 10,
    fullname: 'Nguyễn Văn An',
    company: 'Công ty ABC',
    phone: '0901234567',
    email: 'customer@example.com',
    address: '123 Nguyễn Huệ, TP.HCM',
    customertype: 'Doanh nghiệp',
    createddate: new Date('2026-08-20T08:00:00.000Z'),
  };

  beforeEach(() => {
    customersRepository = {
      findMany: jest.fn(),
      count: jest.fn(),
      findAccessibleById: jest.fn(),
      updateWithActivityLog: jest.fn(),
      toLogValue: jest.fn(),
    };

    customersService = new CustomersService(
      customersRepository as unknown as CustomersRepository,
    );
  });

  describe('findAll', () => {
    it('Sales chỉ lấy danh sách Customer trong phạm vi của chính mình', async () => {
      customersRepository.findMany.mockResolvedValue([customer]);
      customersRepository.count.mockResolvedValue(1);
      const result = await customersService.findAll(
        {} as CustomerQueryDto,
        salesUser,
      );
      expect(customersRepository.findMany).toHaveBeenCalledWith({
        search: undefined,
        customerType: undefined,
        salesUserId: 5,
        skip: 0,
        take: 20,
      });
      expect(customersRepository.count).toHaveBeenCalledWith({
        search: undefined,
        customerType: undefined,
        salesUserId: 5,
      });
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
    });

    it('Customer Care lấy danh sách Customer không bị giới hạn theo Sales', async () => {
      customersRepository.findMany.mockResolvedValue([customer]);
      customersRepository.count.mockResolvedValue(1);

      await customersService.findAll({} as CustomerQueryDto, customerCareUser);

      expect(customersRepository.findMany).toHaveBeenCalledWith({
        search: undefined,
        customerType: undefined,
        salesUserId: undefined,
        skip: 0,
        take: 20,
      });

      expect(customersRepository.count).toHaveBeenCalledWith({
        search: undefined,
        customerType: undefined,
        salesUserId: undefined,
      });
    });

    it('lọc Customer theo từ khóa, loại khách hàng và phân trang', async () => {
      customersRepository.findMany.mockResolvedValue([customer]);
      customersRepository.count.mockResolvedValue(25);
      const query = {
        search: 'Nguyễn',
        customerType: 'Doanh nghiệp',
        page: 2,
        limit: 10,
      } as CustomerQueryDto;
      const result = await customersService.findAll(query, customerCareUser);
      expect(customersRepository.findMany).toHaveBeenCalledWith({
        search: 'Nguyễn',
        customerType: 'Doanh nghiệp',
        salesUserId: undefined,
        skip: 10,
        take: 10,
      });
      expect(customersRepository.count).toHaveBeenCalledWith({
        search: 'Nguyễn',
        customerType: 'Doanh nghiệp',
        salesUserId: undefined,
      });
      expect(result.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
      });
    });

    it('map đúng dữ liệu Customer trả về', async () => {
      customersRepository.findMany.mockResolvedValue([customer]);
      customersRepository.count.mockResolvedValue(1);
      const result = await customersService.findAll(
        {} as CustomerQueryDto,
        customerCareUser,
      );
      expect(result.data[0]).toEqual({
        customerId: 7,
        customerCode: 'CU007',
        leadId: 10,
        fullName: 'Nguyễn Văn An',
        company: 'Công ty ABC',
        phone: '0901234567',
        email: 'customer@example.com',
        address: '123 Nguyễn Huệ, TP.HCM',
        customerType: 'Doanh nghiệp',
        createdAt: new Date('2026-08-20T08:00:00.000Z'),
      });
    });

    it('trả danh sách rỗng khi không có Customer phù hợp', async () => {
      customersRepository.findMany.mockResolvedValue([]);
      customersRepository.count.mockResolvedValue(0);

      const result = await customersService.findAll(
        {
          search: 'Không tồn tại',
          page: 1,
          limit: 20,
        },
        customerCareUser,
      );
      expect(result.data).toEqual([]);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      });
    });
  });

  describe('findOne', () => {
    it('Sales xem được Customer thuộc phạm vi của mình', async () => {
      customersRepository.findAccessibleById.mockResolvedValue(customer);
      const result = await customersService.findOne(7, salesUser);
      expect(customersRepository.findAccessibleById).toHaveBeenCalledWith(7, 5);
      expect(result.customerId).toBe(7);
      expect(result.customerCode).toBe('CU007');
      expect(result.fullName).toBe('Nguyễn Văn An');
    });

    it('Customer Care xem Customer mà không giới hạn theo Sales', async () => {
      customersRepository.findAccessibleById.mockResolvedValue(customer);
      await customersService.findOne(7, customerCareUser);
      expect(customersRepository.findAccessibleById).toHaveBeenCalledWith(
        7,
        undefined,
      );
    });
    it('ném NotFoundException khi Customer không tồn tại hoặc không có quyền truy cập', async () => {
      customersRepository.findAccessibleById.mockResolvedValue(null);

      await expect(customersService.findOne(999, salesUser)).rejects.toThrow(
        new NotFoundException(
          'Không tìm thấy Customer hoặc bạn không có quyền truy cập Customer này.',
        ),
      );
    });
  });

  describe('update', () => {
    it('từ chối cập nhật khi không có dữ liệu Customer cần cập nhật', async () => {
      await expect(customersService.update(7, {}, salesUser)).rejects.toThrow(
        new BadRequestException('Không có dữ liệu Customer cần cập nhật.'),
      );
      expect(customersRepository.findAccessibleById).not.toHaveBeenCalled();
      expect(customersRepository.updateWithActivityLog).not.toHaveBeenCalled();
    });

    it('từ chối cập nhật Customer không tồn tại hoặc Sales không có quyền', async () => {
      customersRepository.findAccessibleById.mockResolvedValue(null);

      await expect(
        customersService.update(
          999,
          {
            fullName: 'Nguyễn Văn B',
          },
          salesUser,
        ),
      ).rejects.toThrow(
        new NotFoundException(
          'Không tìm thấy Customer hoặc bạn không có quyền truy cập Customer này.',
        ),
      );

      expect(customersRepository.updateWithActivityLog).not.toHaveBeenCalled();
    });

    it('cập nhật Customer hợp lệ và chuẩn hóa dữ liệu trước khi lưu', async () => {
      customersRepository.findAccessibleById.mockResolvedValue(customer);
      const oldValue = {
        customerId: 7,
        fullName: 'Nguyễn Văn An',
      };
      customersRepository.toLogValue.mockReturnValue(oldValue);
      const updatedCustomer = {
        ...customer,
        fullname: 'Nguyễn Văn Bình',
        company: 'Công ty XYZ',
        phone: '0987654321',
        email: 'new@example.com',
        address: '456 Lê Lợi',
        customertype: 'Cá nhân',
      };

      customersRepository.updateWithActivityLog.mockResolvedValue(
        updatedCustomer,
      );
      const dto = {
        fullName: '  Nguyễn Văn Bình  ',
        company: '  Công ty XYZ  ',
        phone: '  0987654321  ',
        email: '  NEW@EXAMPLE.COM  ',
        address: '  456 Lê Lợi  ',
        customerType: '  Cá nhân  ',
      } as UpdateCustomerDto;

      const result = await customersService.update(
        7,
        dto,
        salesUser,
        '127.0.0.1',
      );
      expect(customersRepository.findAccessibleById).toHaveBeenCalledWith(7, 5);
      expect(customersRepository.toLogValue).toHaveBeenCalledWith(customer);
      expect(customersRepository.updateWithActivityLog).toHaveBeenCalledWith(
        7,
        {
          fullname: 'Nguyễn Văn Bình',
          company: 'Công ty XYZ',
          phone: '0987654321',
          email: 'new@example.com',
          address: '456 Lê Lợi',
          customertype: 'Cá nhân',
        },
        oldValue,
        5,
        '127.0.0.1',
      );

      expect(result.message).toBe('Cập nhật Customer thành công.');
      expect(result.data.fullName).toBe('Nguyễn Văn Bình');
      expect(result.data.email).toBe('new@example.com');
    });

    it('chuyển các chuỗi tùy chọn rỗng thành null khi cập nhật', async () => {
      customersRepository.findAccessibleById.mockResolvedValue(customer);
      customersRepository.toLogValue.mockReturnValue({ customerId: 7 });
      const updatedCustomer = {
        ...customer,
        company: null,
        phone: null,
        email: null,
        address: null,
        customertype: null,
      };
      customersRepository.updateWithActivityLog.mockResolvedValue(
        updatedCustomer,
      );
      await customersService.update(
        7,
        {
          company: '   ',
          phone: '   ',
          email: null,
          address: '   ',
          customerType: '   ',
        },
        customerCareUser,
      );

      expect(customersRepository.updateWithActivityLog).toHaveBeenCalledWith(
        7,
        {
          fullname: undefined,
          company: null,
          phone: null,
          email: null,
          address: null,
          customertype: null,
        },
        {
          customerId: 7,
        },
        8,
        undefined,
      );
    });

    it('Customer Care cập nhật Customer mà không áp dụng Sales record-level scope', async () => {
      customersRepository.findAccessibleById.mockResolvedValue(customer);
      customersRepository.toLogValue.mockReturnValue({ customerId: 7 });
      customersRepository.updateWithActivityLog.mockResolvedValue({
        ...customer,
        phone: '0911111111',
      });

      await customersService.update(
        7,
        {
          phone: '0911111111',
        },
        customerCareUser,
      );

      expect(customersRepository.findAccessibleById).toHaveBeenCalledWith(
        7,
        undefined,
      );
      expect(customersRepository.updateWithActivityLog).toHaveBeenCalledWith(
        7,
        {
          fullname: undefined,
          company: undefined,
          phone: '0911111111',
          email: undefined,
          address: undefined,
          customertype: undefined,
        },
        {
          customerId: 7,
        },
        8,
        undefined,
      );
    });

    it('truyền IP address của người cập nhật xuống Repository để ghi Activity Log', async () => {
      customersRepository.findAccessibleById.mockResolvedValue(customer);
      customersRepository.toLogValue.mockReturnValue({ customerId: 7 });
      customersRepository.updateWithActivityLog.mockResolvedValue({
        ...customer,
        phone: '0909999999',
      });
      await customersService.update(
        7,
        {
          phone: '0909999999',
        },
        salesUser,
        '192.168.1.10',
      );

      expect(customersRepository.updateWithActivityLog).toHaveBeenCalledWith(
        7,
        expect.any(Object),
        {
          customerId: 7,
        },
        5,
        '192.168.1.10',
      );
    });
  });
});
