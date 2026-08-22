import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UserQueryDto } from './dto/user-query.dto';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

type UsersRepositoryMock = {
  findMany: jest.Mock;
  count: jest.Mock;
  findRoles: jest.Mock;
  findDetailById: jest.Mock;
  findByEmail: jest.Mock;
  findRoleById: jest.Mock;
  createUser: jest.Mock;
  findByEmailExceptUser: jest.Mock;
  updateUser: jest.Mock;
  getRelationCounts: jest.Mock;
  deactivateUser: jest.Mock;
  deleteUser: jest.Mock;
  findById: jest.Mock;
  updatePassword: jest.Mock;
};

describe('UsersService - Admin quản lý Users', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepositoryMock;

  const mockedHash = hash as unknown as jest.Mock;

  const adminUser = {
    userId: 1,
    email: 'admin@crm.com',
    role: 'Admin',
  } as unknown as AuthenticatedUser;

  const salesRole = {
    roleid: 3,
    rolename: 'Sales',
    description: 'Nhân viên Sales',
  };

  const customerCareRole = {
    roleid: 5,
    rolename: 'Customer Care',
    description: 'Nhân viên chăm sóc khách hàng',
  };

  const salesUser = {
    userid: 2,
    fullname: 'Nguyễn Văn Sales',
    email: 'sales@crm.com',
    phone: '0901234567',
    status: true,
    createdat: new Date('2026-08-01T08:00:00.000Z'),
    roles: {
      roleid: 3,
      rolename: 'Sales',
    },
  };

  beforeEach(() => {
    usersRepository = {
      findMany: jest.fn(),
      count: jest.fn(),
      findRoles: jest.fn(),
      findDetailById: jest.fn(),
      findByEmail: jest.fn(),
      findRoleById: jest.fn(),
      createUser: jest.fn(),
      findByEmailExceptUser: jest.fn(),
      updateUser: jest.fn(),
      getRelationCounts: jest.fn(),
      deactivateUser: jest.fn(),
      deleteUser: jest.fn(),
      findById: jest.fn(),
      updatePassword: jest.fn(),
    };

    usersService = new UsersService(
      usersRepository as unknown as UsersRepository,
    );

    mockedHash.mockReset();
    mockedHash.mockResolvedValue('hashed-password');
  });

  describe('findAll', () => {
    it('trả danh sách User và thông tin phân trang', async () => {
      usersRepository.findMany.mockResolvedValue([salesUser]);

      usersRepository.count.mockResolvedValue(1);

      const query = {
        search: '  Sales  ',
        roleId: 3,
        status: true,
        page: 2,
        limit: 10,
      } as UserQueryDto;

      const result = await usersService.findAll(query);

      expect(usersRepository.findMany).toHaveBeenCalledWith({
        search: 'Sales',
        roleId: 3,
        status: true,
        skip: 10,
        take: 10,
      });

      expect(usersRepository.count).toHaveBeenCalledWith({
        search: 'Sales',
        roleId: 3,
        status: true,
      });

      expect(result.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 1,
        totalPages: 1,
      });

      expect(result.data[0]).toEqual({
        userId: 2,
        fullName: 'Nguyễn Văn Sales',
        email: 'sales@crm.com',
        phone: '0901234567',
        status: true,
        createdAt: salesUser.createdat,
        role: {
          roleId: 3,
          roleName: 'Sales',
        },
      });
    });
  });

  describe('findRoles', () => {
    it('trả danh sách Role cho Admin', async () => {
      usersRepository.findRoles.mockResolvedValue([
        salesRole,
        customerCareRole,
      ]);
      const result = await usersService.findRoles();
      expect(result).toEqual([
        {
          roleId: 3,
          roleName: 'Sales',
          description: 'Nhân viên Sales',
        },
        {
          roleId: 5,
          roleName: 'Customer Care',
          description: 'Nhân viên chăm sóc khách hàng',
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('trả chi tiết User khi User tồn tại', async () => {
      usersRepository.findDetailById.mockResolvedValue(salesUser);

      const result = await usersService.findOne(2);

      expect(usersRepository.findDetailById).toHaveBeenCalledWith(2);

      expect(result.userId).toBe(2);
      expect(result.email).toBe('sales@crm.com');
      expect(result.role.roleName).toBe('Sales');
    });

    it('ném NotFoundException khi User không tồn tại', async () => {
      usersRepository.findDetailById.mockResolvedValue(null);
      await expect(usersService.findOne(999)).rejects.toThrow(
        new NotFoundException('Không tìm thấy người dùng.'),
      );
    });
  });

  describe('create', () => {
    it('BR-16 - tạo User và hash mật khẩu trước khi lưu', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findRoleById.mockResolvedValue(salesRole);
      usersRepository.createUser.mockResolvedValue(salesUser);
      const dto = {
        fullName: '  Nguyễn Văn Sales  ',
        email: '  SALES@CRM.COM  ',
        phone: ' 0901234567 ',
        password: 'Password@123',
        roleId: 3,
        status: true,
      } as CreateUserDto;

      const result = await usersService.create(dto, adminUser);

      expect(mockedHash).toHaveBeenCalledWith('Password@123', 12);

      expect(usersRepository.createUser).toHaveBeenCalledWith(
        {
          fullname: 'Nguyễn Văn Sales',
          email: 'sales@crm.com',
          phone: '0901234567',
          passwordhash: 'hashed-password',
          roleid: 3,
          status: true,
        },
        1,
      );

      expect(result.message).toBe('Thêm người dùng thành công.');
    });

    it('BR-16 - từ chối tạo User khi email đã tồn tại', async () => {
      usersRepository.findByEmail.mockResolvedValue(salesUser);

      const dto = {
        fullName: 'User mới',
        email: 'SALES@CRM.COM',
        password: 'Password@123',
        roleId: 3,
      } as CreateUserDto;

      await expect(usersService.create(dto, adminUser)).rejects.toThrow(
        new ConflictException('Email này đã tồn tại.'),
      );

      expect(usersRepository.findByEmail).toHaveBeenCalledWith('sales@crm.com');

      expect(mockedHash).not.toHaveBeenCalled();

      expect(usersRepository.createUser).not.toHaveBeenCalled();
    });

    it('từ chối tạo User khi Role không hợp lệ', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.findRoleById.mockResolvedValue(null);

      const dto = {
        fullName: 'User mới',
        email: 'new@crm.com',
        password: 'Password@123',
        roleId: 999,
      } as CreateUserDto;

      await expect(usersService.create(dto, adminUser)).rejects.toThrow(
        new UnprocessableEntityException('Vai trò người dùng không hợp lệ.'),
      );

      expect(usersRepository.createUser).not.toHaveBeenCalled();
    });

    it('từ chối tạo User khi họ tên chỉ chứa khoảng trắng', async () => {
      const dto = {
        fullName: '   ',
        email: 'new@crm.com',
        password: 'Password@123',
        roleId: 3,
      } as CreateUserDto;

      await expect(usersService.create(dto, adminUser)).rejects.toThrow(
        new UnprocessableEntityException('Họ tên không được để trống.'),
      );

      expect(usersRepository.findByEmail).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('ném NotFoundException khi cập nhật User không tồn tại', async () => {
      usersRepository.findDetailById.mockResolvedValue(null);
      await expect(
        usersService.update(
          999,
          {
            fullName: 'Tên mới',
          },
          adminUser,
        ),
      ).rejects.toThrow(new NotFoundException('Không tìm thấy người dùng.'));
    });

    it('BR-16 - từ chối cập nhật khi email mới bị trùng', async () => {
      usersRepository.findDetailById.mockResolvedValue(salesUser);
      usersRepository.findByEmailExceptUser.mockResolvedValue({ userid: 3 });

      await expect(
        usersService.update(
          2,
          {
            email: 'OTHER@CRM.COM',
          },
          adminUser,
        ),
      ).rejects.toThrow(new ConflictException('Email này đã tồn tại.'));

      expect(usersRepository.findByEmailExceptUser).toHaveBeenCalledWith(
        'other@crm.com',
        2,
      );
      expect(usersRepository.updateUser).not.toHaveBeenCalled();
    });

    it('BR-18 - thay đổi Role phải tạo audit action Assign', async () => {
      usersRepository.findDetailById.mockResolvedValue(salesUser);
      usersRepository.findRoleById.mockResolvedValue(customerCareRole);
      const updatedUser = {
        ...salesUser,
        roles: {
          roleid: 5,
          rolename: 'Customer Care',
        },
      };
      usersRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await usersService.update(2, { roleId: 5 }, adminUser);

      expect(usersRepository.updateUser).toHaveBeenCalledWith(
        2,
        {
          roleid: 5,
        },
        1,
        [
          {
            action: 'Assign',
            oldValue: {
              roleId: 3,
              roleName: 'Sales',
            },
            newValue: {
              roleId: 5,
              roleName: 'Customer Care',
            },
          },
        ],
      );

      expect(result.message).toBe('Cập nhật người dùng thành công.');
      expect(result.user.role.roleName).toBe('Customer Care');
    });

    it('không gọi updateUser khi dữ liệu không thay đổi', async () => {
      usersRepository.findDetailById.mockResolvedValue(salesUser);
      const result = await usersService.update(2, {}, adminUser);

      expect(result.message).toBe('Không có thông tin thay đổi.');
      expect(usersRepository.updateUser).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('không cho Admin xóa chính tài khoản đang đăng nhập', async () => {
      await expect(usersService.remove(1, adminUser)).rejects.toThrow(
        new ForbiddenException('Bạn không thể xóa tài khoản đang đăng nhập.'),
      );

      expect(usersRepository.findDetailById).not.toHaveBeenCalled();
    });

    it('ném NotFoundException khi User cần xóa không tồn tại', async () => {
      usersRepository.findDetailById.mockResolvedValue(null);
      await expect(usersService.remove(999, adminUser)).rejects.toThrow(
        new NotFoundException('Không tìm thấy người dùng.'),
      );
    });

    it('BR-20 - khóa User thay vì xóa khi đã phát sinh dữ liệu nghiệp vụ', async () => {
      usersRepository.findDetailById.mockResolvedValue(salesUser);
      usersRepository.getRelationCounts.mockResolvedValue({
        _count: {
          activities: 1,
          activitylogs: 0,
          deals: 0,
          leads: 0,
          notifications: 0,
          quotes: 0,
          tasks: 0,
        },
      });

      const deactivatedUser = { ...salesUser, status: false };
      usersRepository.deactivateUser.mockResolvedValue(deactivatedUser);
      const result = await usersService.remove(2, adminUser);
      expect(usersRepository.deactivateUser).toHaveBeenCalledWith(
        2,
        1,
        {
          userId: 2,
          fullName: 'Nguyễn Văn Sales',
          email: 'sales@crm.com',
          phone: '0901234567',
          status: true,
          roleId: 3,
          roleName: 'Sales',
        },
        {
          userId: 2,
          fullName: 'Nguyễn Văn Sales',
          email: 'sales@crm.com',
          phone: '0901234567',
          status: false,
          roleId: 3,
          roleName: 'Sales',
        },
      );

      expect(usersRepository.deleteUser).not.toHaveBeenCalled();
      expect(result.mode).toBe('deactivated');
    });

    it('xóa vật lý User khi chưa phát sinh dữ liệu nghiệp vụ', async () => {
      usersRepository.findDetailById.mockResolvedValue(salesUser);
      usersRepository.getRelationCounts.mockResolvedValue({
        _count: {
          activities: 0,
          activitylogs: 0,
          deals: 0,
          leads: 0,
          notifications: 0,
          quotes: 0,
          tasks: 0,
        },
      });

      usersRepository.deleteUser.mockResolvedValue(undefined);
      const result = await usersService.remove(2, adminUser);
      expect(usersRepository.deleteUser).toHaveBeenCalledWith(2, 1, {
        userId: 2,
        fullName: 'Nguyễn Văn Sales',
        email: 'sales@crm.com',
        phone: '0901234567',
        status: true,
        roleId: 3,
        roleName: 'Sales',
      });

      expect(usersRepository.deactivateUser).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Xóa người dùng thành công.',
        mode: 'deleted',
        userId: 2,
      });
    });
  });

  describe('các hàm dùng chung', () => {
    it('chuẩn hóa email trước khi tìm User', async () => {
      usersRepository.findByEmail.mockResolvedValue(salesUser);
      const result = await usersService.findByEmail('  SALES@CRM.COM  ');

      expect(usersRepository.findByEmail).toHaveBeenCalledWith('sales@crm.com');
      expect(result).toEqual(salesUser);
    });

    it('tìm User theo id', async () => {
      usersRepository.findById.mockResolvedValue(salesUser);
      const result = await usersService.findById(2);
      expect(usersRepository.findById).toHaveBeenCalledWith(2);
      expect(result).toEqual(salesUser);
    });

    it('cập nhật password hash thông qua Repository', async () => {
      usersRepository.updatePassword.mockResolvedValue(undefined);
      await usersService.updatePassword(2, 'hashed-password');
      expect(usersRepository.updatePassword).toHaveBeenCalledWith(
        2,
        'hashed-password',
      );
    });
  });
});
