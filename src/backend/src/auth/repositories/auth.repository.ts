import { Injectable } from '@nestjs/common';
import { action_type } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) { }

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

  async deleteUnusedResetTokens(userId: number): Promise<void> {
    await this.prisma.passwordresettokens.deleteMany({
      where: {
        userid: userId,
        usedat: null,
      },
    });
  }

  async createResetToken(
    userId: number,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prisma.passwordresettokens.create({
      data: {
        userid: userId,
        tokenhash: tokenHash,
        expiresat: expiresAt,
      },
    });
  }

  async findResetTokenByHash(tokenHash: string) {
    return this.prisma.passwordresettokens.findUnique({
      where: {
        tokenhash: tokenHash,
      },
    });
  }

  async markResetTokenUsed(resetId: number): Promise<void> {
    await this.prisma.passwordresettokens.update({
      where: {
        resetid: resetId,
      },
      data: {
        usedat: new Date(),
      },
    });
  }
}