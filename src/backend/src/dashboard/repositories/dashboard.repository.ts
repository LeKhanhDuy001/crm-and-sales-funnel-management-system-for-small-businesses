import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../../generated/prisma/client';

interface SalesPerformanceAggregate {
  assigneduserid: number;

  _count: { _all: number };

  _sum: {
    dealvalue: unknown;
    expectedrevenue: unknown;
  };
}

const attentionDealSelect = {
  dealid: true,
  dealname: true,
  dealvalue: true,
  probability: true,
  expectedrevenue: true,
  expectedclosedate: true,
  status: true,
  pipelinestages: {
    select: {
      stagename: true,
    },
  },
  users: {
    select: {
      fullname: true,
    },
  },
  customers: {
    select: {
      fullname: true,
      company: true,
    },
  },
} satisfies Prisma.dealsSelect;

type AttentionDeal = Prisma.dealsGetPayload<{
  select: typeof attentionDealSelect;
}>;

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  //ADMIN

  countUsers() {
    return this.prisma.users.count();
  }

  countLeads() {
    return this.prisma.leads.count();
  }

  countCustomers() {
    return this.prisma.customers.count();
  }

  countDeals() {
    return this.prisma.deals.count();
  }

  countProductsByStatus(status: boolean) {
    return this.prisma.products.count({
      where: {
        status,
      },
    });
  }

  countQuotes() {
    return this.prisma.quotes.count();
  }

  countTasksExcludingStatus(status: string) {
    return this.prisma.tasks.count({
      where: {
        OR: [
          {
            status: null,
          },
          {
            status: {
              not: status,
            },
          },
        ],
      },
    });
  }

  sumDealValueByStatus(status: string) {
    return this.prisma.deals.aggregate({
      where: {
        status,
      },
      _sum: {
        dealvalue: true,
      },
    });
  }

  findPipelineStages() {
    return this.prisma.pipelinestages.findMany({
      orderBy: {
        stageorder: 'asc',
      },
      select: {
        stageid: true,
        stagename: true,
        stageorder: true,
        _count: {
          select: {
            deals: true,
          },
        },
      },
    });
  }

  findRecentLeads(limit: number) {
    return this.prisma.leads.findMany({
      take: limit,
      orderBy: {
        createddate: 'desc',
      },
      select: {
        leadid: true,
        fullname: true,
        company: true,
        email: true,
        status: true,
        createddate: true,
        leadsources: {
          select: {
            sourcename: true,
          },
        },
        users: {
          select: {
            fullname: true,
          },
        },
      },
    });
  }

  //SALES MANAGER

  countUsersByRole(roleName: string) {
    return this.prisma.users.count({
      where: {
        status: true,
        roles: { rolename: roleName },
      },
    });
  }

  findUsersByRole(roleName: string) {
    return this.prisma.users.findMany({
      where: {
        status: true,
        roles: { rolename: roleName },
      },
      orderBy: { fullname: 'asc' },
      select: {
        userid: true,
        fullname: true,
        email: true,
      },
    });
  }

  countOpenDeals() {
    return this.prisma.deals.count({
      where: {
        status: { notIn: ['Won', 'Lost'] },
      },
    });
  }

  aggregateOpenDeals() {
    return this.prisma.deals.aggregate({
      where: {
        status: { notIn: ['Won', 'Lost'] },
      },
      _sum: {
        dealvalue: true,
        expectedrevenue: true,
      },
    });
  }

  async groupDealsByAssignedUsers(
    userIds: number[],
  ): Promise<SalesPerformanceAggregate[]> {
    const result = await this.prisma.deals.groupBy({
      by: ['assigneduserid'],
      where: { assigneduserid: { in: userIds } },
      _count: { _all: true },
      _sum: {
        dealvalue: true,
        expectedrevenue: true,
      },
    });
    return result;
  }

  countTasksForUsersExcludingStatus(userIds: number[], status: string) {
    return this.prisma.tasks.count({
      where: {
        assigneduserid: { in: userIds },
        OR: [{ status: null }, { status: { not: status } }],
      },
    });
  }

  findDealsNeedingAttention(limit: number): Promise<AttentionDeal[]> {
    return this.prisma.deals.findMany({
      take: limit,
      where: {
        expectedclosedate: { not: null },
        status: { notIn: ['Won', 'Lost'] },
      },
      orderBy: { expectedclosedate: 'asc' },
      select: attentionDealSelect,
    });
  }

  //SALES

  countLeadsByAssignedUser(userId: number) {
    return this.prisma.leads.count({
      where: { assigneduserid: userId },
    });
  }

  countDealsByAssignedUser(userId: number) {
    return this.prisma.deals.count({
      where: { assigneduserid: userId },
    });
  }

  aggregateOpenDealsByAssignedUser(userId: number) {
    return this.prisma.deals.aggregate({
      where: {
        assigneduserid: userId,
        status: { notIn: ['Won', 'Lost'] },
      },
      _sum: {
        dealvalue: true,
        expectedrevenue: true,
      },
    });
  }

  countQuotesByCreatedUser(userId: number) {
    return this.prisma.quotes.count({
      where: { createdby: userId },
    });
  }

  countTasksByAssignedUserExcludingStatus(userId: number, status: string) {
    return this.prisma.tasks.count({
      where: {
        assigneduserid: userId,
        OR: [{ status: null }, { status: { not: status } }],
      },
    });
  }

  findPipelineStagesByAssignedUser(userId: number) {
    return this.prisma.pipelinestages.findMany({
      orderBy: { stageorder: 'asc' },
      select: {
        stageid: true,
        stagename: true,
        stageorder: true,
        _count: {
          select: {
            deals: {
              where: { assigneduserid: userId },
            },
          },
        },
      },
    });
  }

  findRecentDealsByAssignedUser(userId: number, limit: number) {
    return this.prisma.deals.findMany({
      take: limit,
      where: { assigneduserid: userId },
      orderBy: { createddate: 'desc' },
      select: {
        dealid: true,
        dealname: true,
        dealvalue: true,
        probability: true,
        expectedrevenue: true,
        expectedclosedate: true,
        status: true,
        pipelinestages: { select: { stagename: true } },
        customers: {
          select: {
            fullname: true,
            company: true,
          },
        },
      },
    });
  }

  findUpcomingTasksByAssignedUser(userId: number, from: Date, limit: number) {
    return this.prisma.tasks.findMany({
      take: limit,
      where: {
        assigneduserid: userId,
        duedate: { gte: from },
        OR: [{ status: null }, { status: { not: 'Completed' } }],
      },
      orderBy: { duedate: 'asc' },
      select: {
        taskid: true,
        title: true,
        priority: true,
        status: true,
        duedate: true,
        deals: {
          select: {
            dealid: true,
            dealname: true,
            customers: {
              select: { fullname: true },
            },
          },
        },
      },
    });
  }

  //MARKETING

  countLeadsCreatedBetween(startDate: Date, endDate: Date) {
    return this.prisma.leads.count({
      where: {
        createddate: {
          gte: startDate,
          lt: endDate,
        },
      },
    });
  }

  countConvertedLeads() {
    return this.prisma.customers.count({
      where: { leadid: { not: null } },
    });
  }

  countLeadSources() {
    return this.prisma.leadsources.count();
  }

  groupLeadsByStatus() {
    return this.prisma.leads.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
  }

  findLeadSourcesWithCount() {
    return this.prisma.leadsources.findMany({
      orderBy: { sourcename: 'asc' },
      select: {
        sourceid: true,
        sourcename: true,
        _count: {
          select: { leads: true },
        },
      },
    });
  }

  //CUSTOMER CARE

  countCustomersNeedingCare(userId: number) {
    return this.prisma.customers.count({
      where: {
        deals: {
          some: {
            tasks: {
              some: {
                assigneduserid: userId,
                OR: [{ status: null }, { status: { not: 'Completed' } }],
              },
            },
          },
        },
      },
    });
  }

  countTasksByAssignedUserDueBetween(
    userId: number,
    startDate: Date,
    endDate: Date,
  ) {
    return this.prisma.tasks.count({
      where: {
        assigneduserid: userId,
        duedate: {
          gte: startDate,
          lt: endDate,
        },
        OR: [{ status: null }, { status: { not: 'Completed' } }],
      },
    });
  }

  countOverdueTasksByAssignedUser(userId: number, now: Date) {
    return this.prisma.tasks.count({
      where: {
        assigneduserid: userId,
        duedate: { lt: now },
        OR: [{ status: null }, { status: { not: 'Completed' } }],
      },
    });
  }

  countActivitiesWithResultByUser(userId: number) {
    return this.prisma.activities.count({
      where: {
        userid: userId,
        result: { not: null },
      },
    });
  }

  findRecentActivitiesByUser(userId: number, limit: number) {
    return this.prisma.activities.findMany({
      take: limit,
      where: { userid: userId },
      orderBy: { activityid: 'desc' },
      select: {
        activityid: true,
        activitytype: true,
        subject: true,
        activitytime: true,
        result: true,
        deals: {
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
        },
      },
    });
  }

  groupActivitiesByTypeForUser(userId: number) {
    return this.prisma.activities.groupBy({
      by: ['activitytype'],
      where: { userid: userId },
      _count: { _all: true },
    });
  }
}
