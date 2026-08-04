import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getAdminDashboard() {
    const [
      totalUsers,
      totalLeads,
      totalCustomers,
      totalDeals,
      totalProducts,
      totalQuotes,
      pendingTasks,
      revenueResult,
      pipelineStages,
      recentLeads,
    ] = await Promise.all([
      this.prisma.users.count(),

      this.prisma.leads.count(),

      this.prisma.customers.count(),

      this.prisma.deals.count(),

      this.prisma.products.count({
        where: {
          status: true,
        },
      }),

      this.prisma.quotes.count(),

      this.prisma.tasks.count({
        where: {
          status: {
            not: 'Completed',
          },
        },
      }),

      this.prisma.deals.aggregate({
        where: {
          status: 'Won',
        },
        _sum: {
          dealvalue: true,
        },
      }),

      this.prisma.pipelinestages.findMany({
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
      }),

      this.prisma.leads.findMany({
        take: 5,
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
      }),
    ]);

    return {
      overview: {
        totalUsers,
        totalLeads,
        totalCustomers,
        totalDeals,
        totalProducts,
        totalQuotes,
        pendingTasks,
        totalRevenue: Number(
          revenueResult._sum.dealvalue ?? 0,
        ),
      },

      pipeline: pipelineStages.map((stage) => ({
        stageId: stage.stageid,
        stageName: stage.stagename,
        stageOrder: stage.stageorder,
        totalDeals: stage._count.deals,
      })),

      recentLeads: recentLeads.map((lead) => ({
        leadId: lead.leadid,
        fullName: lead.fullname,
        company: lead.company,
        email: lead.email,
        status: lead.status,
        source:
          lead.leadsources?.sourcename ?? null,
        assignedUser:
          lead.users?.fullname ?? null,
        createdDate: lead.createddate,
      })),
    };
  }
}