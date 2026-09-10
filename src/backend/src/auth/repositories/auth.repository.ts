import { Injectable } from '@nestjs/common';
import { action_type } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAuthLog(
    userId: number,
    action: action_type,
    ipAddress: string | null,
  ): Promise<void> {
    await this.prisma.activitylogs.create({
      data: {
        userid: userId,
        action,
        tablename: 'users',
        recordid: userId,
        ipaddress: ipAddress,
        newvalue: { event: action },
      },
    });
  }
}
