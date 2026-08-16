import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Prisma } from '../../../generated/prisma/client';

export interface UserFilter {
  search?: string;
  roleId?: number;
  status?: boolean;
}

export interface FindUsersOptions extends UserFilter {
  skip: number;
  take: number;
}

export interface CreateUserData {
  fullname: string;
  email: string;
  phone: string | null;
  passwordhash: string;
  roleid: number;
  status: boolean;
}

export interface UpdateUserData {
  fullname?: string;
  email?: string;
  phone?: string | null;
  roleid?: number;
  status?: boolean;
}

export interface UserAuditChange {
  action: 'Update' | 'Assign';
  oldValue: Record<string, string | number | boolean | null>;
  newValue: Record<string, string | number | boolean | null>;
}

const SAFE_USER_SELECT = {
  userid: true,
  fullname: true,
  email: true,
  phone: true,
  status: true,
  createdat: true,

  roles: {
    select: {
      roleid: true,
      rolename: true,
    },
  },
} satisfies Prisma.usersSelect;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(filter: UserFilter): Prisma.usersWhereInput {
    const where: Prisma.usersWhereInput = {};

    if (filter.search) {
      where.OR = [
        {
          fullname: {
            contains: filter.search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: filter.search,
            mode: 'insensitive',
          },
        },
        {
          phone: { contains: filter.search },
        },
      ];
    }

    if (filter.roleId !== undefined) {
      where.roleid = filter.roleId;
    }

    if (filter.status !== undefined) {
      where.status = filter.status;
    }

    return where;
  }

  async findMany(options: FindUsersOptions) {
    const { skip, take, ...filter } = options;

    return this.prisma.users.findMany({
      where: this.buildWhere(filter),

      select: SAFE_USER_SELECT,

      orderBy: { createdat: 'desc' },
      skip,
      take,
    });
  }

  async count(filter: UserFilter): Promise<number> {
    return this.prisma.users.count({ where: this.buildWhere(filter) });
  }

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: {
        email,
      },
      include: {
        roles: true,
      },
    });
  }

  async findById(userId: number) {
    return this.prisma.users.findUnique({
      where: {
        userid: userId,
      },
      include: {
        roles: true,
      },
    });
  }

  async findDetailById(userId: number) {
    return this.prisma.users.findUnique({
      where: { userid: userId },
      select: SAFE_USER_SELECT,
    });
  }

  async findByEmailExceptUser(email: string, userId: number) {
    return this.prisma.users.findFirst({
      where: {
        email,
        NOT: { userid: userId },
      },
      select: { userid: true },
    });
  }

  async findRoleById(roleId: number) {
    return this.prisma.roles.findUnique({
      where: { roleid: roleId },
      select: {
        roleid: true,
        rolename: true,
        description: true,
      },
    });
  }

  async findRoles() {
    return this.prisma.roles.findMany({
      select: {
        roleid: true,
        rolename: true,
        description: true,
      },
      orderBy: { roleid: 'asc' },
    });
  }

  async createUser(data: CreateUserData, actorUserId: number) {
    return this.prisma.$transaction(async (transaction) => {
      const user = await transaction.users.create({
        data,
        select: SAFE_USER_SELECT,
      });

      // BR-18: Ghi nhận thao tác tạo tài khoản.
      await transaction.activitylogs.create({
        data: {
          userid: actorUserId,
          action: 'Create',
          tablename: 'users',
          recordid: user.userid,

          newvalue: {
            userId: user.userid,
            fullName: user.fullname,
            email: user.email,
            phone: user.phone,
            status: user.status ?? true,
            roleId: user.roles.roleid,
            roleName: user.roles.rolename,
          },
        },
      });

      return user;
    });
  }

  async updateUser(
    userId: number,
    data: UpdateUserData,
    actorUserId: number,
    auditChanges: UserAuditChange[],
  ) {
    return this.prisma.$transaction(async (transaction) => {
      const user = await transaction.users.update({
        where: { userid: userId },
        data,
        select: SAFE_USER_SELECT,
      });

      // BR-18: Ghi nhận các thay đổi của tài khoản.
      await Promise.all(
        auditChanges.map((change) =>
          transaction.activitylogs.create({
            data: {
              userid: actorUserId,
              action: change.action,
              tablename: 'users',
              recordid: userId,
              oldvalue: change.oldValue,
              newvalue: change.newValue,
            },
          }),
        ),
      );
      return user;
    });
  }

  async getRelationCounts(userId: number) {
    return this.prisma.users.findUnique({
      where: { userid: userId },
      select: {
        _count: {
          select: {
            activities: true,
            activitylogs: true,
            deals: true,
            leads: true,
            notifications: true,
            quotes: true,
            tasks: true,
          },
        },
      },
    });
  }

  async deactivateUser(
    userId: number,
    actorUserId: number,
    oldValue: Record<string, string | number | boolean | null>,
    newValue: Record<string, string | number | boolean | null>,
  ) {
    return this.prisma.$transaction(async (transaction) => {
      const user = await transaction.users.update({
        where: { userid: userId },
        data: { status: false },
        select: SAFE_USER_SELECT,
      });

      // BR-18: Ghi nhật ký
      // BR-20: Tài khoản có dữ liệu liên kết được khóa
      await transaction.activitylogs.create({
        data: {
          userid: actorUserId,
          action: 'Delete',
          tablename: 'users',
          recordid: userId,
          oldvalue: oldValue,
          newvalue: newValue,
        },
      });

      return user;
    });
  }

  async deleteUser(
    userId: number,
    actorUserId: number,
    oldValue: Record<string, string | number | boolean | null>,
  ): Promise<void> {
    await this.prisma.$transaction(async (transaction) => {
      await transaction.users.delete({
        where: { userid: userId },
      });

      // BR-18: Ghi nhật ký xóa tài khoản.
      await transaction.activitylogs.create({
        data: {
          userid: actorUserId,
          action: 'Delete',
          tablename: 'users',
          recordid: userId,
          oldvalue: oldValue,
        },
      });
    });
  }

  /**
   * Cập nhật mật khẩu đã được mã hóa của người dùng.
   *
   * @param userId ID của người dùng.
   * @param passwordHash Mật khẩu đã được bcrypt hash.
   */
  async updatePassword(userId: number, passwordHash: string): Promise<void> {
    await this.prisma.users.update({
      where: {
        userid: userId,
      },
      data: {
        passwordhash: passwordHash,
      },
    });
  }
}
