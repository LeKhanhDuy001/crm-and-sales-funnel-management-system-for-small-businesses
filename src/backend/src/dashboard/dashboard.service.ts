import { Injectable } from '@nestjs/common';
import { Role } from '../common/enums/role.enum';
import { DashboardRepository } from './repositories/dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  /**
   * Tổng hợp dữ liệu Dashboard dành cho Admin.
   * @returns Số liệu tổng quan, Pipeline và Lead mới nhất.
   */
  async getAdminDashboard() {
    const [overview, pipelineStages, recentLeads] = await Promise.all([
      this.getAdminOverview(),
      this.dashboardRepository.findPipelineStages(),
      this.dashboardRepository.findRecentLeads(5),
    ]);

    return {
      overview,
      pipeline: this.mapPipelineStages(pipelineStages),
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

  /**
   * Tổng hợp dữ liệu Dashboard dành cho Sales Manager.
   * @returns Thống kê đội Sales, Pipeline, hiệu suất và Deal cần chú ý.
   */
  async getSalesManagerDashboard() {
    const now = new Date();
    const salesUsers = await this.dashboardRepository.findUsersByRole(
      Role.SALES,
    );

    const salesUserIds = salesUsers.map((user) => user.userid);

    const [
      totalSales,
      openDeals,
      openDealTotals,
      wonRevenue,
      pendingTasks,
      pipelineStages,
      dealPerformance,
      attentionDeals,
    ] = await Promise.all([
      this.dashboardRepository.countUsersByRole(Role.SALES),
      this.dashboardRepository.countOpenDeals(),
      this.dashboardRepository.aggregateOpenDeals(),
      this.dashboardRepository.sumDealValueByStatus('Won'),
      this.dashboardRepository.countTasksForUsersExcludingStatus(
        salesUserIds,
        'Completed',
      ),
      this.dashboardRepository.findPipelineStages(),
      salesUserIds.length > 0
        ? this.dashboardRepository.groupDealsByAssignedUsers(salesUserIds)
        : Promise.resolve([]),
      this.dashboardRepository.findDealsNeedingAttention(5),
    ]);

    const performanceMap = new Map<number, (typeof dealPerformance)[number]>(
      dealPerformance.map((item) => [item.assigneduserid, item] as const),
    );

    return {
      overview: {
        totalSales,
        openDeals,
        pipelineValue: Number(openDealTotals._sum.dealvalue ?? 0),
        expectedRevenue: Number(openDealTotals._sum.expectedrevenue ?? 0),
        wonRevenue: Number(wonRevenue._sum.dealvalue ?? 0),
        pendingTasks,
      },

      pipeline: this.mapPipelineStages(pipelineStages),

      salesPerformance: salesUsers.map((user) => {
        const performance = performanceMap.get(user.userid);
        return {
          userId: user.userid,
          fullName: user.fullname,
          email: user.email,
          totalDeals: performance?._count._all ?? 0,
          totalDealValue: Number(performance?._sum.dealvalue ?? 0),
          expectedRevenue: Number(performance?._sum.expectedrevenue ?? 0),
        };
      }),

      attentionDeals: attentionDeals.map((deal) => {
        const carePriority = this.getDealCarePriority(
          deal.expectedclosedate,
          now,
        );

        return {
          dealId: deal.dealid,
          dealName: deal.dealname,
          dealValue: Number(deal.dealvalue),
          probability: deal.probability,
          expectedRevenue: Number(deal.expectedrevenue ?? 0),
          expectedCloseDate: deal.expectedclosedate,
          status: deal.status,
          stage: deal.pipelinestages.stagename,
          assignedUser: deal.users.fullname,
          customer: deal.customers.fullname,
          company: deal.customers.company,
          daysToClose: carePriority.daysToClose,
          carePriority: carePriority.carePriority,
          priorityReason: carePriority.priorityReason,
        };
      }),
    };
  }

  /**
   * Tổng hợp dữ liệu Dashboard cá nhân của Sales.
   * @param userId ID của Sales đang đăng nhập.
   * @returns Lead, Deal, Pipeline, Quote và Task của Sales.
   */
  async getSalesDashboard(userId: number) {
    const now = new Date();

    const [
      totalLeads,
      totalDeals,
      openDealTotals,
      totalQuotes,
      pendingTasks,
      pipelineStages,
      recentDeals,
      upcomingTasks,
    ] = await Promise.all([
      this.dashboardRepository.countLeadsByAssignedUser(userId),
      this.dashboardRepository.countDealsByAssignedUser(userId),
      this.dashboardRepository.aggregateOpenDealsByAssignedUser(userId),
      this.dashboardRepository.countQuotesByCreatedUser(userId),
      this.dashboardRepository.countTasksByAssignedUserExcludingStatus(
        userId,
        'Completed',
      ),
      this.dashboardRepository.findPipelineStagesByAssignedUser(userId),
      this.dashboardRepository.findRecentDealsByAssignedUser(userId, 5),
      this.dashboardRepository.findUpcomingTasksByAssignedUser(userId, now, 5),
    ]);

    return {
      overview: {
        totalLeads,
        totalDeals,
        pipelineValue: Number(openDealTotals._sum.dealvalue ?? 0),
        expectedRevenue: Number(openDealTotals._sum.expectedrevenue ?? 0),
        totalQuotes,
        pendingTasks,
      },

      pipeline: this.mapPipelineStages(pipelineStages),

      recentDeals: recentDeals.map((deal) => ({
        dealId: deal.dealid,
        dealName: deal.dealname,
        dealValue: Number(deal.dealvalue),
        probability: deal.probability,
        expectedRevenue: Number(deal.expectedrevenue ?? 0),
        expectedCloseDate: deal.expectedclosedate,
        status: deal.status,
        stage: deal.pipelinestages.stagename,
        customer: deal.customers.fullname,
        company: deal.customers.company,
      })),

      upcomingTasks: upcomingTasks.map((task) => ({
        taskId: task.taskid,
        title: task.title,
        priority: task.priority,
        status: task.status,
        dueDate: task.duedate,
        dealId: task.deals?.dealid ?? null,
        dealName: task.deals?.dealname ?? null,
        customer: task.deals?.customers.fullname ?? null,
      })),
    };
  }

  /**
   * Tổng hợp dữ liệu Dashboard dành cho Marketing.
   * @returns Thống kê Lead, nguồn Lead và tỷ lệ chuyển đổi.
   */
  async getMarketingDashboard() {
    const { startDate, endDate } = this.getCurrentMonthRange();

    const [
      totalLeads,
      newLeadsThisMonth,
      convertedLeads,
      totalLeadSources,
      leadSources,
      leadStatuses,
      recentLeads,
    ] = await Promise.all([
      this.dashboardRepository.countLeads(),
      this.dashboardRepository.countLeadsCreatedBetween(startDate, endDate),
      this.dashboardRepository.countConvertedLeads(),
      this.dashboardRepository.countLeadSources(),
      this.dashboardRepository.findLeadSourcesWithCount(),
      this.dashboardRepository.groupLeadsByStatus(),
      this.dashboardRepository.findRecentLeads(5),
    ]);

    const unconvertedLeads = Math.max(totalLeads - convertedLeads, 0);

    const conversionRate =
      totalLeads === 0
        ? 0
        : Number(((convertedLeads / totalLeads) * 100).toFixed(2));

    return {
      overview: {
        totalLeads,
        newLeadsThisMonth,
        convertedLeads,
        unconvertedLeads,
        conversionRate,
        totalLeadSources,
      },

      leadsBySource: leadSources.map((source) => ({
        sourceId: source.sourceid,
        sourceName: source.sourcename,
        totalLeads: source._count.leads,
      })),

      leadsByStatus: leadStatuses.map((item) => ({
        status: item.status ?? 'Chưa xác định',
        totalLeads: item._count._all,
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

  /**
   * Tổng hợp dữ liệu Dashboard cá nhân của Customer Care.
   * @param userId ID của Customer Care đang đăng nhập.
   * @returns Thống kê chăm sóc khách hàng, Task và Activity.
   */
  async getCustomerCareDashboard(userId: number) {
    const now = new Date();
    const { startDate, endDate } = this.getTodayRange(now);

    const [
      customersNeedingCare,
      todayTasks,
      pendingTasks,
      overdueTasks,
      completedActivities,
      upcomingTasks,
      recentActivities,
      activitiesByType,
    ] = await Promise.all([
      this.dashboardRepository.countCustomersNeedingCare(userId),
      this.dashboardRepository.countTasksByAssignedUserDueBetween(
        userId,
        startDate,
        endDate,
      ),
      this.dashboardRepository.countTasksByAssignedUserExcludingStatus(
        userId,
        'Completed',
      ),
      this.dashboardRepository.countOverdueTasksByAssignedUser(userId, now),
      this.dashboardRepository.countActivitiesWithResultByUser(userId),
      this.dashboardRepository.findUpcomingTasksByAssignedUser(userId, now, 5),
      this.dashboardRepository.findRecentActivitiesByUser(userId, 5),
      this.dashboardRepository.groupActivitiesByTypeForUser(userId),
    ]);

    return {
      overview: {
        customersNeedingCare,
        todayTasks,
        pendingTasks,
        overdueTasks,
        completedActivities,
      },

      upcomingTasks: upcomingTasks.map((task) => ({
        taskId: task.taskid,
        title: task.title,
        priority: task.priority,
        status: task.status,
        dueDate: task.duedate,
        dealId: task.deals?.dealid ?? null,
        dealName: task.deals?.dealname ?? null,
        customer: task.deals?.customers.fullname ?? null,
      })),

      recentActivities: recentActivities.map((activity) => ({
        activityId: activity.activityid,
        activityType: activity.activitytype,
        subject: activity.subject,
        activityTime: activity.activitytime,
        result: activity.result,
        dealId: activity.deals.dealid,
        dealName: activity.deals.dealname,
        customerId: activity.deals.customers.customerid,
        customer: activity.deals.customers.fullname,
        company: activity.deals.customers.company,
      })),

      activitiesByType: activitiesByType.map((item) => ({
        activityType: item.activitytype ?? 'Chưa xác định',
        totalActivities: item._count._all,
      })),
    };
  }

  private async getAdminOverview() {
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

  private mapPipelineStages<
    T extends {
      stageid: number;
      stagename: string;
      stageorder: number;
      _count: { deals: number };
    },
  >(stages: T[]) {
    return stages.map((stage) => ({
      stageId: stage.stageid,
      stageName: stage.stagename,
      stageOrder: stage.stageorder,
      totalDeals: stage._count.deals,
    }));
  }

  private getDealCarePriority(expectedCloseDate: Date | null, now: Date) {
    if (!expectedCloseDate) {
      return {
        daysToClose: null,
        carePriority: 'Low',
        priorityReason: 'Deal chưa có ngày dự kiến chốt.',
      };
    }

    const oneDay = 24 * 60 * 60 * 1000;

    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

    const closeDate = Date.UTC(
      expectedCloseDate.getFullYear(),
      expectedCloseDate.getMonth(),
      expectedCloseDate.getDate(),
    );

    const daysToClose = Math.round((closeDate - today) / oneDay);

    if (daysToClose < 0) {
      return {
        daysToClose,
        carePriority: 'High',
        priorityReason: `Deal đã quá hạn ${Math.abs(daysToClose)} ngày.`,
      };
    }

    if (daysToClose <= 3) {
      return {
        daysToClose,
        carePriority: 'High',
        priorityReason:
          daysToClose === 0
            ? 'Deal dự kiến chốt hôm nay.'
            : `Deal còn ${daysToClose} ngày đến ngày dự kiến chốt.`,
      };
    }

    if (daysToClose <= 7) {
      return {
        daysToClose,
        carePriority: 'Medium',
        priorityReason: `Deal còn ${daysToClose} ngày đến ngày dự kiến chốt.`,
      };
    }

    return {
      daysToClose,
      carePriority: 'Low',
      priorityReason: `Deal còn ${daysToClose} ngày đến ngày dự kiến chốt.`,
    };
  }

  private getCurrentMonthRange() {
    const now = new Date();

    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);

    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return { startDate, endDate };
  }

  private getTodayRange(now: Date) {
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const endDate = new Date(startDate);

    endDate.setDate(endDate.getDate() + 1);

    return { startDate, endDate };
  }
}
