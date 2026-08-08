import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

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
