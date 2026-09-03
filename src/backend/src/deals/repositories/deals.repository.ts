import { Injectable } from '@nestjs/common';
import { action_type, Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface DealFilter {
  search?: string;
  stageId?: number;
  salesUserId?: number;
}

export interface CreateDealData {
  customerid: number;
  assigneduserid: number;
  stageid: number;
  dealname: string;
  dealvalue: Prisma.Decimal;
  probability: number;
  expectedrevenue: Prisma.Decimal;
  expectedclosedate: Date | null;
  status: string;
}

export interface UpdateDealData {
  customerid?: number;
  dealname?: string;
  dealvalue?: Prisma.Decimal;
  expectedrevenue?: Prisma.Decimal;
  expectedclosedate?: Date | null;
}

export interface ChangeDealStageData {
  dealId: number;
  stageId: number;
  stageName: string;
  probability: number;
  expectedRevenue: Prisma.Decimal;
  status: string;
  currentDeal: DealWithRelations;
  userId: number;
  ipAddress?: string;
}

export const dealSelect = {
  dealid: true,
  customerid: true,
  assigneduserid: true,
  stageid: true,
  dealname: true,
  dealvalue: true,
  probability: true,
  expectedrevenue: true,
  expectedclosedate: true,
  status: true,
  createddate: true,

  customers: {
    select: {
      customerid: true,
      fullname: true,
      company: true,
    },
  },

  pipelinestages: {
    select: {
      stageid: true,
      stagename: true,
      stageorder: true,
    },
  },

  users: {
    select: {
      userid: true,
      fullname: true,
    },
  },
} satisfies Prisma.dealsSelect;

export type DealWithRelations = Prisma.dealsGetPayload<{
  select: typeof dealSelect;
}>;

@Injectable()
export class DealsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(filter: DealFilter, skip: number, take: number) {
    return this.prisma.deals.findMany({
      where: this.buildWhere(filter),
      select: dealSelect,
      orderBy: { createddate: 'desc' },
      skip,
      take,
    });
  }

  async count(filter: DealFilter): Promise<number> {
    return this.prisma.deals.count({
      where: this.buildWhere(filter),
    });
  }

  async findOwnedById(dealId: number, salesUserId: number) {
    return this.prisma.deals.findFirst({
      where: {
        dealid: dealId,
        assigneduserid: salesUserId,
      },
      select: dealSelect,
    });
  }

  async findById(dealId: number) {
    return this.prisma.deals.findUnique({
      where: { dealid: dealId },
      select: dealSelect,
    });
  }

  async findCustomerById(customerId: number) {
    return this.prisma.customers.findUnique({
      where: { customerid: customerId },
      select: {
        customerid: true,
      },
    });
  }

  async findUserById(userId: number) {
    return this.prisma.users.findUnique({
      where: { userid: userId },
      select: {
        userid: true,
        fullname: true,
        email: true,
        status: true,
        roles: {
          select: { rolename: true },
        },
      },
    });
  }

  async findActiveUsersByRole(roleName: string) {
    return this.prisma.users.findMany({
      where: {
        status: true,
        roles: { rolename: roleName },
      },
      select: {
        userid: true,
        fullname: true,
        email: true,
      },
      orderBy: { fullname: 'asc' },
    });
  }

  async findCustomerAccessible(customerId: number, salesUserId: number) {
    return this.prisma.customers.findFirst({
      where: {
        customerid: customerId,
        OR: [
          {
            leads: {
              is: { assigneduserid: salesUserId },
            },
          },
          {
            deals: {
              some: { assigneduserid: salesUserId },
            },
          },
        ],
      },
      select: { customerid: true },
    });
  }

  async findStageById(stageId: number) {
    return this.prisma.pipelinestages.findUnique({
      where: { stageid: stageId },
    });
  }

  async findInitialStage() {
    return this.prisma.pipelinestages.findFirst({
      orderBy: [{ stageorder: 'asc' }, { stageid: 'asc' }],
    });
  }

  async findPipelineStages() {
    return this.prisma.pipelinestages.findMany({
      orderBy: { stageorder: 'asc' },
    });
  }

  async createWithLog(
    data: CreateDealData,
    actorUserId: number,
    ipAddress: string | null,
    notifyAssignee = false,
  ) {
    return this.prisma.$transaction(async (transaction) => {
      const deal = await transaction.deals.create({ data, select: dealSelect });
      if (notifyAssignee) {
        // BR-14: Sales được Sales Manager giao Deal phải nhận Notification.
        await transaction.notifications.create({
          data: {
            userid: deal.assigneduserid,
            title: 'Bạn được phân công Deal mới',
            content: `Bạn được phân công Deal "${deal.dealname}".`,
            type: 'DealAssignment',
            isread: false,
          },
        });
      }
      await transaction.activitylogs.create({
        data: {
          userid: actorUserId,
          action: action_type.Create,
          tablename: 'deals',
          recordid: deal.dealid,
          ipaddress: ipAddress,
        },
      });

      return deal;
    });
  }

  async updateWithLog(
    dealId: number,
    data: UpdateDealData,
    actorUserId: number,
    ipAddress: string | null,
  ) {
    return this.prisma.$transaction(async (transaction) => {
      const deal = await transaction.deals.update({
        where: { dealid: dealId },
        data,
        select: dealSelect,
      });

      await transaction.activitylogs.create({
        data: {
          userid: actorUserId,
          action: action_type.Update,
          tablename: 'deals',
          recordid: dealId,
          ipaddress: ipAddress,
        },
      });

      return deal;
    });
  }

  async getLinkedRecordCount(dealId: number) {
    return this.prisma.deals.findUnique({
      where: { dealid: dealId },
      select: {
        _count: {
          select: {
            quotes: true,
            activities: true,
            tasks: true,
          },
        },
      },
    });
  }

  async deleteWithLog(
    dealId: number,
    actorUserId: number,
    ipAddress: string | null,
  ): Promise<void> {
    await this.prisma.$transaction(async (transaction) => {
      await transaction.activitylogs.create({
        data: {
          userid: actorUserId,
          action: action_type.Delete,
          tablename: 'deals',
          recordid: dealId,
          ipaddress: ipAddress,
        },
      });

      await transaction.deals.delete({
        where: { dealid: dealId },
      });
    });
  }

  async assignWithLog(
    dealId: number,
    assignedUserId: number,
    actorUserId: number,
    currentDeal: DealWithRelations,
    ipAddress?: string,
  ) {
    return this.prisma.$transaction(async (transaction) => {
      const deal = await transaction.deals.update({
        where: { dealid: dealId },
        data: {
          assigneduserid: assignedUserId,
        },
        select: dealSelect,
      });

      // BR-14: Deal được phân công phải tạo Notification cho Sales nhận Deal.
      await transaction.notifications.create({
        data: {
          userid: assignedUserId,
          title: 'Bạn được phân công Deal mới',
          content: `Bạn được phân công Deal "${deal.dealname}".`,
          type: 'DealAssignment',
          isread: false,
        },
      });

      // BR-18: Thao tác phân công Deal phải được ghi Activity Log.
      await transaction.activitylogs.create({
        data: {
          userid: actorUserId,
          action: action_type.Update,
          tablename: 'deals',
          recordid: dealId,
          oldvalue: {
            assignedUserId: currentDeal.assigneduserid,
          },
          newvalue: { assignedUserId },
          ipaddress: ipAddress ?? null,
        },
      });

      return deal;
    });
  }

  private buildWhere(filter: DealFilter): Prisma.dealsWhereInput {
    const where: Prisma.dealsWhereInput = {};

    if (filter.salesUserId !== undefined) {
      where.assigneduserid = filter.salesUserId;
    }

    if (filter.stageId !== undefined) {
      where.stageid = filter.stageId;
    }

    if (filter.search?.trim()) {
      const search = filter.search.trim();

      where.OR = [
        {
          dealname: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          customers: {
            is: {
              fullname: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          customers: {
            is: {
              company: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    return where;
  }

  async changeStageWithLog(
    input: ChangeDealStageData,
  ): Promise<DealWithRelations> {
    return this.prisma.$transaction(async (transaction) => {
      const updatedDeal = await transaction.deals.update({
        where: { dealid: input.dealId },
        data: {
          stageid: input.stageId,
          probability: input.probability,
          expectedrevenue: input.expectedRevenue,
          status: input.status,
        },
        select: dealSelect,
      });

      await transaction.activitylogs.create({
        data: {
          userid: input.userId,
          action: action_type.Change_Stage,
          tablename: 'deals',
          recordid: input.dealId,
          ipaddress: input.ipAddress ?? null,

          oldvalue: {
            stageId: input.currentDeal.stageid,
            stageName: input.currentDeal.pipelinestages.stagename,
            probability: input.currentDeal.probability,
            expectedRevenue:
              input.currentDeal.expectedrevenue === null
                ? null
                : Number(input.currentDeal.expectedrevenue),
            status: input.currentDeal.status,
          },

          newvalue: {
            stageId: input.stageId,
            stageName: input.stageName,
            probability: input.probability,
            expectedRevenue: Number(input.expectedRevenue),
            status: input.status,
          },
        },
      });

      return updatedDeal;
    });
  }
}
