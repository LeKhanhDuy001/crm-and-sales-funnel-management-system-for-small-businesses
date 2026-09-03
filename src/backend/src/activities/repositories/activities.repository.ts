import { Injectable } from '@nestjs/common';
import {
  action_type,
  Prisma,
  activity_status,
} from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const activitySelect = {
  activityid: true,
  dealid: true,
  userid: true,
  activitytype: true,
  subject: true,
  description: true,
  activitytime: true,
  result: true,
  status: true,

  users: {
    select: {
      userid: true,
      fullname: true,
      email: true,
    },
  },

  deals: {
    select: {
      dealid: true,
      dealname: true,
      assigneduserid: true,
      customers: {
        select: {
          customerid: true,
          fullname: true,
          company: true,
        },
      },
    },
  },
} satisfies Prisma.activitiesSelect;

export type ActivityWithRelations = Prisma.activitiesGetPayload<{
  select: typeof activitySelect;
}>;

export interface CreateActivityData {
  dealId: number;
  userId: number;
  activityType: string;
  subject: string;
  description: string;
  activityTime: Date;
  ipAddress?: string;
}

@Injectable()
export class ActivitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findSalesDealsForActivity(userId: number) {
    return this.prisma.deals.findMany({
      where: { assigneduserid: userId },
      select: {
        dealid: true,
        dealname: true,
        customers: {
          select: {
            customerid: true,
            fullname: true,
            company: true,
          },
        },
      },
      orderBy: { dealname: 'asc' },
    });
  }

  findCustomerCareDealsForActivity(userId: number) {
    return this.prisma.deals.findMany({
      where: {
        tasks: {
          some: {
            assigneduserid: userId,
            OR: [
              {
                status: null,
              },
              {
                status: {
                  notIn: ['Completed', 'Cancelled'],
                },
              },
            ],
          },
        },
      },
      select: {
        dealid: true,
        dealname: true,
        customers: {
          select: {
            customerid: true,
            fullname: true,
            company: true,
          },
        },
      },
      orderBy: { dealname: 'asc' },
    });
  }

  findDealById(dealId: number) {
    return this.prisma.deals.findUnique({
      where: { dealid: dealId },
      select: {
        dealid: true,
        dealname: true,
        assigneduserid: true,
        customers: {
          select: {
            customerid: true,
            fullname: true,
            company: true,
          },
        },
        tasks: {
          select: {
            taskid: true,
            assigneduserid: true,
            status: true,
          },
        },
      },
    });
  }

  findActiveAssignedTaskForDeal(dealId: number, userId: number) {
    return this.prisma.tasks.findFirst({
      where: {
        dealid: dealId,
        assigneduserid: userId,
        OR: [
          {
            status: null,
          },
          {
            status: {
              notIn: ['Completed', 'Cancelled'],
            },
          },
        ],
      },
      select: { taskid: true },
    });
  }

  findById(activityId: number) {
    return this.prisma.activities.findUnique({
      where: { activityid: activityId },
      select: activitySelect,
    });
  }

  findManyByUser(userId: number) {
    return this.prisma.activities.findMany({
      where: { userid: userId },
      orderBy: { activitytime: 'desc' },
      select: activitySelect,
    });
  }

  async createWithActivityLog(
    input: CreateActivityData,
  ): Promise<ActivityWithRelations> {
    return this.prisma.$transaction(async (transaction) => {
      // BR-31: Activity mới phải ở trạng thái Pending và chưa có kết quả chăm sóc.
      const activity = await transaction.activities.create({
        data: {
          dealid: input.dealId,
          userid: input.userId,
          activitytype: input.activityType,
          subject: input.subject,
          description: input.description,
          activitytime: input.activityTime,
          status: activity_status.Pending,
          result: null,
        },
        select: activitySelect,
      });

      // BR-18: thao tác tạo Activity phải được ghi vào Activity Log.
      await transaction.activitylogs.create({
        data: {
          userid: input.userId,
          action: action_type.Create,
          tablename: 'activities',
          recordid: activity.activityid,
          ipaddress: input.ipAddress ?? null,
          newvalue: {
            dealId: activity.dealid,
            activityType: activity.activitytype,
            subject: activity.subject,
            description: activity.description,
            activityTime: activity.activitytime?.toISOString() ?? null,
            result: activity.result,
            status: activity.status,
          },
        },
      });

      return activity;
    });
  }

  async updateResultWithActivityLog(
    activityId: number,
    result: string,
    currentActivity: ActivityWithRelations,
    actorUserId: number,
    ipAddress?: string,
  ): Promise<ActivityWithRelations> {
    return this.prisma.$transaction(async (transaction) => {
      // BR-31: Khi có kết quả chăm sóc, Activity chuyển sang trạng thái Completed.
      const activity = await transaction.activities.update({
        where: { activityid: activityId },
        data: {
          result,
          status: activity_status.Completed,
        },
        select: activitySelect,
      });

      // BR-18: cập nhật kết quả Activity phải được ghi vào Activity Log.
      await transaction.activitylogs.create({
        data: {
          userid: actorUserId,
          action: action_type.Update,
          tablename: 'activities',
          recordid: activityId,
          ipaddress: ipAddress ?? null,
          oldvalue: {
            result: currentActivity.result,
            status: currentActivity.status,
          },
          newvalue: {
            result: activity.result,
            status: activity.status,
          },
        },
      });

      return activity;
    });
  }

  // BR-32: Hủy Activity bằng cách chuyển sang Cancelled, không xóa vật lý để bảo toàn lịch sử chăm sóc.
  async cancelWithActivityLog(
    activityId: number,
    currentActivity: ActivityWithRelations,
    actorUserId: number,
    ipAddress?: string,
  ): Promise<ActivityWithRelations> {
    return this.prisma.$transaction(async (transaction) => {
      const activity = await transaction.activities.update({
        where: { activityid: activityId },
        data: { status: activity_status.Cancelled },
        select: activitySelect,
      });

      // BR-18: hủy Activity phải được ghi vào Activity Log.
      await transaction.activitylogs.create({
        data: {
          userid: actorUserId,
          action: action_type.Update,
          tablename: 'activities',
          recordid: activityId,
          ipaddress: ipAddress ?? null,
          oldvalue: { status: currentActivity.status },
          newvalue: { status: activity.status },
        },
      });
      return activity;
    });
  }
}
