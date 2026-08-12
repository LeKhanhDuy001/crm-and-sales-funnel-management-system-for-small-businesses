import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

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
        status: {
          not: status,
        },
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
}
