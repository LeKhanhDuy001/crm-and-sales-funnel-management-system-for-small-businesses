import { Injectable } from '@nestjs/common';
import type { Prisma, action_type } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface ActivityLogFilter {
  userId?: number;
  action?: action_type;
  fromDate?: Date;
  toDateExclusive?: Date;
}

export interface FindActivityLogsOptions extends ActivityLogFilter {
  skip: number;
  take: number;
}

function createWhere(filter: ActivityLogFilter): Prisma.activitylogsWhereInput {
  const where: Prisma.activitylogsWhereInput = {};

  if (filter.userId !== undefined) {
    where.userid = filter.userId;
  }

  if (filter.action !== undefined) {
    where.action = filter.action;
  }

  if (filter.fromDate || filter.toDateExclusive) {
    where.actiontime = {
      ...(filter.fromDate ? { gte: filter.fromDate } : {}),
      ...(filter.toDateExclusive ? { lt: filter.toDateExclusive } : {}),
    };
  }

  return where;
}

@Injectable()
export class ActivityLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(options: FindActivityLogsOptions) {
    const { skip, take, ...filter } = options;

    return this.prisma.activitylogs.findMany({
      where: createWhere(filter),
      include: {
        users: {
          select: {
            userid: true,
            fullname: true,
            email: true,
          },
        },
      },
      orderBy: [{ actiontime: 'desc' }, { logid: 'desc' }],
      skip,
      take,
    });
  }

  count(filter: ActivityLogFilter) {
    return this.prisma.activitylogs.count({
      where: createWhere(filter),
    });
  }

  findUsers() {
    return this.prisma.users.findMany({
      select: {
        userid: true,
        fullname: true,
        email: true,
      },
      orderBy: { fullname: 'asc' },
    });
  }
}
