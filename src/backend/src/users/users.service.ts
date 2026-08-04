import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: {
        email: email.trim().toLowerCase(),
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
}
