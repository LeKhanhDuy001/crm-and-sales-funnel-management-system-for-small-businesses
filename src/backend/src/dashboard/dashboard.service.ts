import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './repositories/dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  /**
   * Tổng hợp dữ liệu dashboard cho admin
   * @returns Số liệu tổng quan, Pipeline bán hàng và danh sách Lead mới nhất
   */
  async getAdminDashboard() {
    const [overview, pipelineStages, recentLeads] = await Promise.all([
      this.getOverview(),
      this.dashboardRepository.findPipelineStages(),
      this.dashboardRepository.findRecentLeads(5),
    ]);

    return {
      overview,

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
        source: lead.leadsources?.sourcename ?? null,
        assignedUser: lead.users?.fullname ?? null,
        createdDate: lead.createddate,
      })),
    };
  }

  private async getOverview() {
    const [
      totalUsers,
      totalLeads,
      totalCustomers,
      totalDeals,
      totalProducts,
      totalQuotes,
      pendingTasks,
      revenueResult,
    ] = await Promise.all([
      this.dashboardRepository.countUsers(),
      this.dashboardRepository.countLeads(),
      this.dashboardRepository.countCustomers(),
      this.dashboardRepository.countDeals(),
      this.dashboardRepository.countProductsByStatus(true),
      this.dashboardRepository.countQuotes(),
      this.dashboardRepository.countTasksExcludingStatus('Completed'),
      this.dashboardRepository.sumDealValueByStatus('Won'),
    ]);

    return {
      totalUsers,
      totalLeads,
      totalCustomers,
      totalDeals,
      totalProducts,
      totalQuotes,
      pendingTasks,
      totalRevenue: Number(revenueResult._sum.dealvalue ?? 0),
    };
  }
}
