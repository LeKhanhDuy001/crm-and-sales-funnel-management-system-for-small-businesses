import {
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  UsersRepository,
  type UpdateUserData,
  type UserAuditChange,
} from './repositories/users.repository';
import { UserQueryDto } from './dto/user-query.dto';
import { hash } from 'bcrypt';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

interface UserWithRole {
  userid: number;
  fullname: string;
  email: string;
  phone: string | null;
  status: boolean | null;
  createdat: Date | null;

  roles: {
    roleid: number;
    rolename: string;
  };
}

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * Admin lấy danh sách tài khoản người dùng.
   */
  async findAll(query: UserQueryDto) {
    const { search, roleId, status, page = 1, limit = 20 } = query;

    const filter = { search: search?.trim() || undefined, roleId, status };

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.usersRepository.findMany({
        ...filter,
        skip,
        take: limit,
      }),

      this.usersRepository.count(filter),
    ]);

    return {
      data: users.map((user) => ({
        userId: user.userid,
        fullName: user.fullname,
        email: user.email,
        phone: user.phone,
        status: user.status ?? true,
        createdAt: user.createdat,

        role: {
          roleId: user.roles.roleid,
          roleName: user.roles.rolename,
        },
      })),

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy danh sách vai trò để Admin gán cho tài khoản.
   *
   * @returns Danh sách vai trò.
   */
  async findRoles() {
    const roles = await this.usersRepository.findRoles();

    return roles.map((role) => ({
      roleId: role.roleid,
      roleName: role.rolename,
      description: role.description,
    }));
  }

  /**
   * Lấy chi tiết một người dùng.
   *
   * @param userId Mã người dùng.
   * @returns Thông tin người dùng.
   */
  async findOne(userId: number) {
    const user = await this.usersRepository.findDetailById(userId);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng.');
    }

    return this.mapUser(user);
  }

  /**
   * Tạo tài khoản người dùng mới.
   *
   * @param dto Dữ liệu tài khoản mới.
   * @param currentUser Admin đang thực hiện thao tác.
   * @returns Tài khoản vừa được tạo.
   */
  async create(dto: CreateUserDto, currentUser: AuthenticatedUser) {
    const fullName = dto.fullName.trim();

    if (!fullName) {
      throw new UnprocessableEntityException('Họ tên không được để trống.');
    }

    const email = dto.email.trim().toLowerCase();

    // BR-16: Email người dùng phải là duy nhất.
    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email này đã tồn tại.');
    }

    const role = await this.usersRepository.findRoleById(dto.roleId);

    if (!role) {
      throw new UnprocessableEntityException(
        'Vai trò người dùng không hợp lệ.',
      );
    }

    // BR-16: Mật khẩu phải được mã hóa trước khi lưu vào cơ sở dữ liệu.
    const passwordHash = await hash(dto.password, 12);

    const user = await this.usersRepository.createUser(
      {
        fullname: fullName,
        email,
        phone: dto.phone?.trim() || null,
        passwordhash: passwordHash,
        roleid: dto.roleId,
        status: dto.status ?? true,
      },
      currentUser.userId,
    );

    return {
      message: 'Thêm người dùng thành công.',
      user: this.mapUser(user),
    };
  }

  /**
   * Cập nhật thông tin và vai trò của người dùng.
   *
   * @param userId Mã người dùng cần cập nhật.
   * @param dto Dữ liệu cần cập nhật.
   * @param currentUser Admin đang thực hiện thao tác.
   * @returns Người dùng sau khi cập nhật.
   */
  async update(
    userId: number,
    dto: UpdateUserDto,
    currentUser: AuthenticatedUser,
  ) {
    const current = await this.usersRepository.findDetailById(userId);

    if (!current) {
      throw new NotFoundException('Không tìm thấy người dùng.');
    }

    const data: UpdateUserData = {};
    const auditChanges: UserAuditChange[] = [];

    await this.prepareProfileUpdate(current, dto, data, auditChanges);

    await this.prepareRoleUpdate(current, dto, data, auditChanges);

    if (auditChanges.length === 0) {
      return {
        message: 'Không có thông tin thay đổi.',
        user: this.mapUser(current),
      };
    }

    const user = await this.usersRepository.updateUser(
      userId,
      data,
      currentUser.userId,
      auditChanges,
    );

    return {
      message: 'Cập nhật người dùng thành công.',
      user: this.mapUser(user),
    };
  }

  /**
   * Xóa người dùng nếu chưa phát sinh dữ liệu nghiệp vụ;
   * nếu đã có liên kết thì khóa tài khoản.
   *
   * @param userId Mã người dùng cần xóa.
   * @param currentUser Admin đang thực hiện thao tác.
   * @returns Kết quả xóa hoặc khóa tài khoản.
   */
  async remove(userId: number, currentUser: AuthenticatedUser) {
    const user = await this.usersRepository.findDetailById(userId);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng.');
    }

    const firstAdmin = await this.usersRepository.findFirstAdmin();

    if (firstAdmin && userId === firstAdmin.userid) {
      throw new ForbiddenException('Không thể xóa tài khoản Super Admin.');
    }
    if (userId === currentUser.userId) {
      throw new ForbiddenException(
        'Bạn không thể xóa tài khoản đang đăng nhập.',
      );
    }

    const relationResult = await this.usersRepository.getRelationCounts(userId);

    const hasBusinessLinks = relationResult
      ? Object.values(relationResult._count).some((count) => count > 0)
      : false;

    const oldValue = this.createAuditSnapshot(user);

    // BR-20: Dữ liệu đã phát sinh liên kết
    // không được xóa vật lý.
    if (hasBusinessLinks) {
      const updated = await this.usersRepository.deactivateUser(
        userId,
        currentUser.userId,
        oldValue,
        {
          ...oldValue,
          status: false,
        },
      );

      return {
        message:
          'Người dùng đã phát sinh dữ liệu nghiệp vụ nên tài khoản đã được khóa thay vì xóa vật lý.',
        mode: 'deactivated',
        user: this.mapUser(updated),
      };
    }

    await this.usersRepository.deleteUser(userId, currentUser.userId, oldValue);

    return {
      message: 'Xóa người dùng thành công.',
      mode: 'deleted',
      userId,
    };
  }

  /**
   * Tìm người dùng theo email sau khi chuẩn hóa email.
   *
   * @param email Email của người dùng.
   * @returns Người dùng cùng thông tin vai trò hoặc null.
   */
  async findByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    return this.usersRepository.findByEmail(normalizedEmail);
  }

  /**
   * Tìm người dùng theo mã định danh.
   *
   * @param userId Mã định danh của người dùng
   * @returns Người dùng cùng với thông tin vai trò hoặc null nếu không tồn tại
   */
  async findById(userId: number) {
    return this.usersRepository.findById(userId);
  }

  /**
   * Cập nhật mật khẩu đã được mã hóa của người dùng.
   *
   * @param userId ID của người dùng.
   * @param passwordHash Mật khẩu đã được hash.
   */
  async updatePassword(userId: number, passwordHash: string): Promise<void> {
    await this.usersRepository.updatePassword(userId, passwordHash);
  }

  private async prepareProfileUpdate(
    current: UserWithRole,
    dto: UpdateUserDto,
    data: UpdateUserData,
    audits: UserAuditChange[],
  ): Promise<void> {
    const oldProfile = this.createProfileSnapshot(current);

    if (dto.fullName !== undefined) {
      const fullName = dto.fullName.trim();

      if (!fullName) {
        throw new UnprocessableEntityException('Họ tên không được để trống.');
      }

      data.fullname = fullName;
    }

    if (dto.email !== undefined) {
      const email = dto.email.trim().toLowerCase();

      if (email !== current.email) {
        // BR-16: Email phải là duy nhất.
        const duplicate = await this.usersRepository.findByEmailExceptUser(
          email,
          current.userid,
        );

        if (duplicate) {
          throw new ConflictException('Email này đã tồn tại.');
        }
      }

      data.email = email;
    }

    if (dto.phone !== undefined) {
      data.phone = dto.phone.trim() || null;
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    const newProfile = {
      fullName: data.fullname ?? current.fullname,
      email: data.email ?? current.email,
      phone: data.phone !== undefined ? data.phone : current.phone,
      status: data.status ?? current.status ?? true,
    };

    if (JSON.stringify(oldProfile) !== JSON.stringify(newProfile)) {
      audits.push({
        action: 'Update',
        oldValue: oldProfile,
        newValue: newProfile,
      });
    }
  }

  private async prepareRoleUpdate(
    current: UserWithRole,
    dto: UpdateUserDto,
    data: UpdateUserData,
    audits: UserAuditChange[],
  ): Promise<void> {
    if (dto.roleId === undefined || dto.roleId === current.roles.roleid) {
      return;
    }

    const role = await this.usersRepository.findRoleById(dto.roleId);

    if (!role) {
      throw new UnprocessableEntityException(
        'Vai trò người dùng không hợp lệ.',
      );
    }

    data.roleid = dto.roleId;

    // BR-18: Thay đổi quyền phải được ghi nhận.
    audits.push({
      action: 'Assign',

      oldValue: {
        roleId: current.roles.roleid,
        roleName: current.roles.rolename,
      },

      newValue: {
        roleId: role.roleid,
        roleName: role.rolename,
      },
    });
  }

  private createProfileSnapshot(user: UserWithRole) {
    return {
      fullName: user.fullname,
      email: user.email,
      phone: user.phone,
      status: user.status ?? true,
    };
  }

  private createAuditSnapshot(user: UserWithRole) {
    return {
      userId: user.userid,
      fullName: user.fullname,
      email: user.email,
      phone: user.phone,
      status: user.status ?? true,
      roleId: user.roles.roleid,
      roleName: user.roles.rolename,
    };
  }

  private mapUser(user: UserWithRole) {
    return {
      userId: user.userid,
      fullName: user.fullname,
      email: user.email,
      phone: user.phone,
      status: user.status ?? true,
      createdAt: user.createdat,

      role: {
        roleId: user.roles.roleid,
        roleName: user.roles.rolename,
      },
    };
  }
}
