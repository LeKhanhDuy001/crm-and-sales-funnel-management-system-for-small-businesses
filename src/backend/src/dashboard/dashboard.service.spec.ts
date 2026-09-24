import { Prisma } from '../../generated/prisma/client';
import { Role } from '../common/enums/role.enum';
import { DashboardService } from './dashboard.service';
import { DashboardRepository } from './repositories/dashboard.repository';

type DashboardRepositoryMock = {
  countUsers: jest.Mock;
  countLeads: jest.Mock;
  countCustomers: jest.Mock;
  countDeals: jest.Mock;
  countProductsByStatus: jest.Mock;
  countQuotes: jest.Mock;
  countTasksExcludingStatus: jest.Mock;
  sumDealValueByStatus: jest.Mock;
  findPipelineStages: jest.Mock;
  findRecentLeads: jest.Mock;

  countUsersByRole: jest.Mock;
  findUsersByRole: jest.Mock;
  countOpenDeals: jest.Mock;
  aggregateOpenDeals: jest.Mock;
  groupDealsByAssignedUsers: jest.Mock;
  countTasksForUsersExcludingStatus: jest.Mock;
  findDealsNeedingAttention: jest.Mock;

  countLeadsByAssignedUser: jest.Mock;
  countDealsByAssignedUser: jest.Mock;
  aggregateOpenDealsByAssignedUser: jest.Mock;
  countQuotesByCreatedUser: jest.Mock;
  countTasksByAssignedUserExcludingStatus: jest.Mock;
  findPipelineStagesByAssignedUser: jest.Mock;
  findRecentDealsByAssignedUser: jest.Mock;
  findUpcomingTasksByAssignedUser: jest.Mock;

  countLeadsCreatedBetween: jest.Mock;
  countConvertedLeads: jest.Mock;
  countLeadSources: jest.Mock;
  groupLeadsByStatus: jest.Mock;
  findLeadSourcesWithCount: jest.Mock;

  countCustomersNeedingCare: jest.Mock;
  countTasksByAssignedUserDueBetween: jest.Mock;
  countOverdueTasksByAssignedUser: jest.Mock;
  countActivitiesWithResultByUser: jest.Mock;
  findRecentActivitiesByUser: jest.Mock;
  groupActivitiesByTypeForUser: jest.Mock;
};

describe('DashboardService - tổng hợp Dashboard theo vai trò', () => {
  let dashboardService: DashboardService;
  let dashboardRepository: DashboardRepositoryMock;

  const now = new Date(2026, 7, 26, 10, 30, 0);

  const pipelineStages = [
    {
      stageid: 1,
      stagename: 'Lead',
      stageorder: 1,
      _count: { deals: 2 },
    },
    {
      stageid: 2,
      stagename: 'Qualified',
      stageorder: 2,
      _count: { deals: 1 },
    },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(now);

    dashboardRepository = {
      countUsers: jest.fn(),
      countLeads: jest.fn(),
      countCustomers: jest.fn(),
      countDeals: jest.fn(),
      countProductsByStatus: jest.fn(),
      countQuotes: jest.fn(),
      countTasksExcludingStatus: jest.fn(),
      sumDealValueByStatus: jest.fn(),
      findPipelineStages: jest.fn(),
      findRecentLeads: jest.fn(),

      countUsersByRole: jest.fn(),
      findUsersByRole: jest.fn(),
      countOpenDeals: jest.fn(),
      aggregateOpenDeals: jest.fn(),
      groupDealsByAssignedUsers: jest.fn(),
      countTasksForUsersExcludingStatus: jest.fn(),
      findDealsNeedingAttention: jest.fn(),

      countLeadsByAssignedUser: jest.fn(),
      countDealsByAssignedUser: jest.fn(),
      aggregateOpenDealsByAssignedUser: jest.fn(),
      countQuotesByCreatedUser: jest.fn(),
      countTasksByAssignedUserExcludingStatus: jest.fn(),
      findPipelineStagesByAssignedUser: jest.fn(),
      findRecentDealsByAssignedUser: jest.fn(),
      findUpcomingTasksByAssignedUser: jest.fn(),

      countLeadsCreatedBetween: jest.fn(),
      countConvertedLeads: jest.fn(),
      countLeadSources: jest.fn(),
      groupLeadsByStatus: jest.fn(),
      findLeadSourcesWithCount: jest.fn(),

      countCustomersNeedingCare: jest.fn(),
      countTasksByAssignedUserDueBetween: jest.fn(),
      countOverdueTasksByAssignedUser: jest.fn(),
      countActivitiesWithResultByUser: jest.fn(),
      findRecentActivitiesByUser: jest.fn(),
      groupActivitiesByTypeForUser: jest.fn(),
    };

    dashboardService = new DashboardService(
      dashboardRepository as unknown as DashboardRepository,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getAdminDashboard', () => {
    it('BR-19 - Admin lấy đúng số liệu tổng quan toàn hệ thống', async () => {
      dashboardRepository.countUsers.mockResolvedValue(10);
      dashboardRepository.countLeads.mockResolvedValue(11);
      dashboardRepository.countCustomers.mockResolvedValue(6);
      dashboardRepository.countDeals.mockResolvedValue(8);
      dashboardRepository.countProductsByStatus.mockResolvedValue(12);
      dashboardRepository.countQuotes.mockResolvedValue(4);
      dashboardRepository.countTasksExcludingStatus.mockResolvedValue(6);

      dashboardRepository.sumDealValueByStatus.mockResolvedValue({
        _sum: { dealvalue: new Prisma.Decimal(31_000_000) },
      });

      dashboardRepository.findPipelineStages.mockResolvedValue(pipelineStages);

      dashboardRepository.findRecentLeads.mockResolvedValue([
        {
          leadid: 7,
          fullname: 'Nguyễn Văn Lead',
          company: 'Công ty Demo',
          email: 'lead@example.com',
          status: 'Qualified',
          createddate: new Date('2026-08-25T08:00:00'),
          leadsources: { sourcename: 'Website' },
          users: { fullname: 'Nguyễn Văn Sales' },
        },
      ]);

      const result = await dashboardService.getAdminDashboard();

      expect(dashboardRepository.countProductsByStatus).toHaveBeenCalledWith(
        true,
      );
      expect(
        dashboardRepository.countTasksExcludingStatus,
      ).toHaveBeenCalledWith('Completed');
      expect(dashboardRepository.sumDealValueByStatus).toHaveBeenCalledWith(
        'Won',
      );
      expect(dashboardRepository.findRecentLeads).toHaveBeenCalledWith(5);
      expect(result.overview).toEqual({
        totalUsers: 10,
        totalLeads: 11,
        totalCustomers: 6,
        totalDeals: 8,
        totalProducts: 12,
        totalQuotes: 4,
        pendingTasks: 6,
        totalRevenue: 31_000_000,
      });
      expect(result.pipeline).toEqual([
        {
          stageId: 1,
          stageName: 'Lead',
          stageOrder: 1,
          totalDeals: 2,
        },
        {
          stageId: 2,
          stageName: 'Qualified',
          stageOrder: 2,
          totalDeals: 1,
        },
      ]);
      expect(result.recentLeads[0]).toMatchObject({
        leadId: 7,
        fullName: 'Nguyễn Văn Lead',
        company: 'Công ty Demo',
        email: 'lead@example.com',
        status: 'Qualified',
        source: 'Website',
        assignedUser: 'Nguyễn Văn Sales',
      });
    });

    it('trả totalRevenue = 0 khi chưa có Deal Won', async () => {
      dashboardRepository.countUsers.mockResolvedValue(0);
      dashboardRepository.countLeads.mockResolvedValue(0);
      dashboardRepository.countCustomers.mockResolvedValue(0);
      dashboardRepository.countDeals.mockResolvedValue(0);
      dashboardRepository.countProductsByStatus.mockResolvedValue(0);
      dashboardRepository.countQuotes.mockResolvedValue(0);
      dashboardRepository.countTasksExcludingStatus.mockResolvedValue(0);
      dashboardRepository.sumDealValueByStatus.mockResolvedValue({
        _sum: { dealvalue: null },
      });
      dashboardRepository.findPipelineStages.mockResolvedValue([]);
      dashboardRepository.findRecentLeads.mockResolvedValue([]);
      const result = await dashboardService.getAdminDashboard();
      expect(result.overview.totalRevenue).toBe(0);
      expect(result.pipeline).toEqual([]);
      expect(result.recentLeads).toEqual([]);
    });
  });

  describe('getSalesManagerDashboard', () => {
    it('BR-09, BR-19 - Sales Manager xem đúng tổng hợp đội Sales và Expected Revenue', async () => {
      jest.useFakeTimers();
      jest.setSystemTime(now);
      dashboardRepository.findUsersByRole.mockResolvedValue([
        {
          userid: 5,
          fullname: 'Nguyễn Văn Sales',
          email: 'sales@crm.com',
        },
        {
          userid: 6,
          fullname: 'Trần Thị Sales',
          email: 'sales2@crm.com',
        },
      ]);

      dashboardRepository.countUsersByRole.mockResolvedValue(2);
      dashboardRepository.countOpenDeals.mockResolvedValue(3);
      dashboardRepository.aggregateOpenDeals.mockResolvedValue({
        _sum: {
          dealvalue: new Prisma.Decimal(50_000_000),
          expectedrevenue: new Prisma.Decimal(27_000_000),
        },
      });
      dashboardRepository.sumDealValueByStatus.mockResolvedValue({
        _sum: { dealvalue: new Prisma.Decimal(20_000_000) },
      });
      dashboardRepository.countTasksForUsersExcludingStatus.mockResolvedValue(
        4,
      );
      dashboardRepository.findPipelineStages.mockResolvedValue(pipelineStages);
      dashboardRepository.groupDealsByAssignedUsers.mockResolvedValue([
        {
          assigneduserid: 5,
          _count: {
            _all: 2,
          },
          _sum: {
            dealvalue: new Prisma.Decimal(30_000_000),
            expectedrevenue: new Prisma.Decimal(17_000_000),
          },
        },
      ]);

      dashboardRepository.findDealsNeedingAttention.mockResolvedValue([
        {
          dealid: 7,
          dealname: 'Deal High',
          dealvalue: new Prisma.Decimal(10_000_000),
          probability: 70,
          expectedrevenue: new Prisma.Decimal(7_000_000),
          expectedclosedate: new Date(2026, 7, 29),
          status: 'Open',
          pipelinestages: {
            stagename: 'Negotiation',
          },
          users: {
            fullname: 'Nguyễn Văn Sales',
          },
          customers: {
            fullname: 'Nguyễn Văn A',
            company: 'Công ty A',
          },
        },
        {
          dealid: 8,
          dealname: 'Deal Medium',
          dealvalue: new Prisma.Decimal(8_000_000),
          probability: 50,
          expectedrevenue: new Prisma.Decimal(4_000_000),
          expectedclosedate: new Date(2026, 7, 30),
          status: 'Open',
          pipelinestages: {
            stagename: 'Proposal',
          },
          users: {
            fullname: 'Trần Thị Sales',
          },
          customers: {
            fullname: 'Trần Văn B',
            company: 'Công ty B',
          },
        },
        {
          dealid: 9,
          dealname: 'Deal Low',
          dealvalue: new Prisma.Decimal(5_000_000),
          probability: 30,
          expectedrevenue: new Prisma.Decimal(1_500_000),
          expectedclosedate: new Date(2026, 8, 3),
          status: 'Open',
          pipelinestages: {
            stagename: 'Qualified',
          },
          users: {
            fullname: 'Nguyễn Văn Sales',
          },
          customers: {
            fullname: 'Lê Văn C',
            company: 'Công ty C',
          },
        },
      ]);

      const result = await dashboardService.getSalesManagerDashboard();

      expect(dashboardRepository.findUsersByRole).toHaveBeenCalledWith(
        Role.SALES,
      );
      expect(dashboardRepository.countUsersByRole).toHaveBeenCalledWith(
        Role.SALES,
      );
      expect(
        dashboardRepository.countTasksForUsersExcludingStatus,
      ).toHaveBeenCalledWith([5, 6], 'Completed');
      expect(
        dashboardRepository.groupDealsByAssignedUsers,
      ).toHaveBeenCalledWith([5, 6]);
      expect(
        dashboardRepository.findDealsNeedingAttention,
      ).toHaveBeenCalledWith(5);
      expect(result.overview).toEqual({
        totalSales: 2,
        openDeals: 3,
        pipelineValue: 50_000_000,
        expectedRevenue: 27_000_000,
        wonRevenue: 20_000_000,
        pendingTasks: 4,
      });
      expect(result.salesPerformance).toEqual([
        {
          userId: 5,
          fullName: 'Nguyễn Văn Sales',
          email: 'sales@crm.com',
          totalDeals: 2,
          totalDealValue: 30_000_000,
          expectedRevenue: 17_000_000,
        },
        {
          userId: 6,
          fullName: 'Trần Thị Sales',
          email: 'sales2@crm.com',
          totalDeals: 0,
          totalDealValue: 0,
          expectedRevenue: 0,
        },
      ]);
      expect(result.attentionDeals).toHaveLength(3);

      expect(result.attentionDeals[0]).toMatchObject({
        dealId: 7,
        dealName: 'Deal High',
        daysToClose: 3,
        carePriority: 'High',
        priorityReason: 'Deal còn 3 ngày đến ngày dự kiến chốt.',
      });

      expect(result.attentionDeals[1]).toMatchObject({
        dealId: 8,
        dealName: 'Deal Medium',
        daysToClose: 4,
        carePriority: 'Medium',
        priorityReason: 'Deal còn 4 ngày đến ngày dự kiến chốt.',
      });

      expect(result.attentionDeals[2]).toMatchObject({
        dealId: 9,
        dealName: 'Deal Low',
        daysToClose: 8,
        carePriority: 'Low',
        priorityReason: 'Deal còn 8 ngày đến ngày dự kiến chốt.',
      });
    });

    it('không group Deal khi hệ thống không có Sales đang hoạt động', async () => {
      dashboardRepository.findUsersByRole.mockResolvedValue([]);
      dashboardRepository.countUsersByRole.mockResolvedValue(0);
      dashboardRepository.countOpenDeals.mockResolvedValue(0);

      dashboardRepository.aggregateOpenDeals.mockResolvedValue({
        _sum: {
          dealvalue: null,
          expectedrevenue: null,
        },
      });
      dashboardRepository.sumDealValueByStatus.mockResolvedValue({
        _sum: {
          dealvalue: null,
        },
      });
      dashboardRepository.countTasksForUsersExcludingStatus.mockResolvedValue(
        0,
      );
      dashboardRepository.findPipelineStages.mockResolvedValue([]);
      dashboardRepository.findDealsNeedingAttention.mockResolvedValue([]);

      const result = await dashboardService.getSalesManagerDashboard();

      expect(
        dashboardRepository.groupDealsByAssignedUsers,
      ).not.toHaveBeenCalled();
      expect(
        dashboardRepository.countTasksForUsersExcludingStatus,
      ).toHaveBeenCalledWith([], 'Completed');
      expect(result.overview).toEqual({
        totalSales: 0,
        openDeals: 0,
        pipelineValue: 0,
        expectedRevenue: 0,
        wonRevenue: 0,
        pendingTasks: 0,
      });
      expect(result.salesPerformance).toEqual([]);
    });
  });

  describe('getSalesDashboard', () => {
    it('BR-19 - Sales chỉ lấy dữ liệu Dashboard thuộc user đang đăng nhập', async () => {
      const userId = 5;

      dashboardRepository.countLeadsByAssignedUser.mockResolvedValue(4);
      dashboardRepository.countDealsByAssignedUser.mockResolvedValue(3);
      dashboardRepository.aggregateOpenDealsByAssignedUser.mockResolvedValue({
        _sum: {
          dealvalue: new Prisma.Decimal(30_000_000),
          expectedrevenue: new Prisma.Decimal(15_000_000),
        },
      });
      dashboardRepository.countQuotesByCreatedUser.mockResolvedValue(2);
      dashboardRepository.countTasksByAssignedUserExcludingStatus.mockResolvedValue(
        3,
      );
      dashboardRepository.findPipelineStagesByAssignedUser.mockResolvedValue(
        pipelineStages,
      );
      dashboardRepository.findRecentDealsByAssignedUser.mockResolvedValue([
        {
          dealid: 7,
          dealname: 'Triển khai CRM',
          dealvalue: new Prisma.Decimal(10_000_000),
          probability: 50,
          expectedrevenue: new Prisma.Decimal(5_000_000),
          expectedclosedate: new Date('2026-09-30'),
          status: 'Open',
          pipelinestages: {
            stagename: 'Proposal',
          },
          customers: {
            fullname: 'Nguyễn Văn A',
            company: 'Công ty A',
          },
        },
      ]);
      dashboardRepository.findUpcomingTasksByAssignedUser.mockResolvedValue([
        {
          taskid: 10,
          title: 'Liên hệ khách hàng',
          priority: 'High',
          status: 'Pending',
          duedate: new Date('2026-08-27T09:00:00'),
          deals: {
            dealid: 7,
            dealname: 'Triển khai CRM',
            customers: {
              fullname: 'Nguyễn Văn A',
            },
          },
        },
        {
          taskid: 11,
          title: 'Công việc khác',
          priority: 'Normal',
          status: 'Pending',
          duedate: new Date('2026-08-28T09:00:00'),
          deals: null,
        },
      ]);

      const result = await dashboardService.getSalesDashboard(userId);

      expect(dashboardRepository.countLeadsByAssignedUser).toHaveBeenCalledWith(
        userId,
      );
      expect(dashboardRepository.countDealsByAssignedUser).toHaveBeenCalledWith(
        userId,
      );
      expect(
        dashboardRepository.aggregateOpenDealsByAssignedUser,
      ).toHaveBeenCalledWith(userId);
      expect(dashboardRepository.countQuotesByCreatedUser).toHaveBeenCalledWith(
        userId,
      );
      expect(
        dashboardRepository.countTasksByAssignedUserExcludingStatus,
      ).toHaveBeenCalledWith(userId, 'Completed');
      expect(
        dashboardRepository.findPipelineStagesByAssignedUser,
      ).toHaveBeenCalledWith(userId);
      expect(
        dashboardRepository.findRecentDealsByAssignedUser,
      ).toHaveBeenCalledWith(userId, 5);
      expect(
        dashboardRepository.findUpcomingTasksByAssignedUser,
      ).toHaveBeenCalledWith(userId, now, 5);
      expect(result.overview).toEqual({
        totalLeads: 4,
        totalDeals: 3,
        pipelineValue: 30_000_000,
        expectedRevenue: 15_000_000,
        totalQuotes: 2,
        pendingTasks: 3,
      });
      expect(result.recentDeals[0]).toMatchObject({
        dealId: 7,
        dealName: 'Triển khai CRM',
        dealValue: 10_000_000,
        probability: 50,
        expectedRevenue: 5_000_000,
        stage: 'Proposal',
        customer: 'Nguyễn Văn A',
        company: 'Công ty A',
      });
      expect(result.upcomingTasks[0]).toMatchObject({
        taskId: 10,
        dealId: 7,
        dealName: 'Triển khai CRM',
        customer: 'Nguyễn Văn A',
      });
      expect(result.upcomingTasks[1]).toMatchObject({
        taskId: 11,
        dealId: null,
        dealName: null,
        customer: null,
      });
    });
  });

  describe('getMarketingDashboard', () => {
    it('BR-19 - Marketing tổng hợp đúng Lead và tỷ lệ chuyển đổi', async () => {
      dashboardRepository.countLeads.mockResolvedValue(10);
      dashboardRepository.countLeadsCreatedBetween.mockResolvedValue(3);
      dashboardRepository.countConvertedLeads.mockResolvedValue(4);
      dashboardRepository.countLeadSources.mockResolvedValue(2);
      dashboardRepository.findLeadSourcesWithCount.mockResolvedValue([
        {
          sourceid: 1,
          sourcename: 'Website',
          _count: {
            leads: 6,
          },
        },
        {
          sourceid: 2,
          sourcename: 'Facebook',
          _count: {
            leads: 4,
          },
        },
      ]);

      dashboardRepository.groupLeadsByStatus.mockResolvedValue([
        {
          status: 'New',
          _count: {
            _all: 6,
          },
        },
        {
          status: null,
          _count: {
            _all: 1,
          },
        },
      ]);

      dashboardRepository.findRecentLeads.mockResolvedValue([]);

      const result = await dashboardService.getMarketingDashboard();
      const expectedStartDate = new Date(2026, 7, 1);
      const expectedEndDate = new Date(2026, 8, 1);

      expect(dashboardRepository.countLeadsCreatedBetween).toHaveBeenCalledWith(
        expectedStartDate,
        expectedEndDate,
      );
      expect(result.overview).toEqual({
        totalLeads: 10,
        newLeadsThisMonth: 3,
        convertedLeads: 4,
        unconvertedLeads: 6,
        conversionRate: 40,
        totalLeadSources: 2,
      });
      expect(result.leadsBySource).toEqual([
        {
          sourceId: 1,
          sourceName: 'Website',
          totalLeads: 6,
        },
        {
          sourceId: 2,
          sourceName: 'Facebook',
          totalLeads: 4,
        },
      ]);
      expect(result.leadsByStatus).toEqual([
        {
          status: 'New',
          totalLeads: 6,
        },
        {
          status: 'Chưa xác định',
          totalLeads: 1,
        },
      ]);
    });

    it('trả conversionRate = 0 khi chưa có Lead', async () => {
      dashboardRepository.countLeads.mockResolvedValue(0);
      dashboardRepository.countLeadsCreatedBetween.mockResolvedValue(0);
      dashboardRepository.countConvertedLeads.mockResolvedValue(0);
      dashboardRepository.countLeadSources.mockResolvedValue(0);
      dashboardRepository.findLeadSourcesWithCount.mockResolvedValue([]);
      dashboardRepository.groupLeadsByStatus.mockResolvedValue([]);
      dashboardRepository.findRecentLeads.mockResolvedValue([]);

      const result = await dashboardService.getMarketingDashboard();
      expect(result.overview).toEqual({
        totalLeads: 0,
        newLeadsThisMonth: 0,
        convertedLeads: 0,
        unconvertedLeads: 0,
        conversionRate: 0,
        totalLeadSources: 0,
      });
    });
  });

  describe('getCustomerCareDashboard', () => {
    it('BR-19 - Customer Care chỉ tổng hợp Task và Activity thuộc user hiện tại', async () => {
      const userId = 9;
      dashboardRepository.countCustomersNeedingCare.mockResolvedValue(2);
      dashboardRepository.countTasksByAssignedUserDueBetween.mockResolvedValue(
        1,
      );
      dashboardRepository.countTasksByAssignedUserExcludingStatus.mockResolvedValue(
        3,
      );
      dashboardRepository.countOverdueTasksByAssignedUser.mockResolvedValue(1);
      dashboardRepository.countActivitiesWithResultByUser.mockResolvedValue(4);
      dashboardRepository.findUpcomingTasksByAssignedUser.mockResolvedValue([
        {
          taskid: 15,
          title: 'Chăm sóc khách hàng',
          priority: 'High',
          status: 'Pending',
          duedate: new Date('2026-08-27T08:00:00'),
          deals: {
            dealid: 7,
            dealname: 'Triển khai CRM',
            customers: {
              fullname: 'Nguyễn Văn A',
            },
          },
        },
      ]);

      dashboardRepository.findRecentActivitiesByUser.mockResolvedValue([
        {
          activityid: 20,
          activitytype: 'Call',
          subject: 'Gọi chăm sóc khách hàng',
          activitytime: new Date('2026-08-25T10:00:00'),
          result: 'Khách hàng đồng ý trao đổi',
          deals: {
            dealid: 7,
            dealname: 'Triển khai CRM',
            customers: {
              customerid: 3,
              fullname: 'Nguyễn Văn A',
              company: 'Công ty A',
            },
          },
        },
      ]);

      dashboardRepository.groupActivitiesByTypeForUser.mockResolvedValue([
        {
          activitytype: 'Call',
          _count: {
            _all: 3,
          },
        },
        {
          activitytype: null,
          _count: {
            _all: 1,
          },
        },
      ]);

      const result = await dashboardService.getCustomerCareDashboard(userId);
      const startDate = new Date(2026, 7, 26);
      const endDate = new Date(2026, 7, 27);

      expect(
        dashboardRepository.countCustomersNeedingCare,
      ).toHaveBeenCalledWith(userId);
      expect(
        dashboardRepository.countTasksByAssignedUserDueBetween,
      ).toHaveBeenCalledWith(userId, startDate, endDate);
      expect(
        dashboardRepository.countTasksByAssignedUserExcludingStatus,
      ).toHaveBeenCalledWith(userId, 'Completed');

      expect(
        dashboardRepository.countOverdueTasksByAssignedUser,
      ).toHaveBeenCalledWith(userId, now);
      expect(
        dashboardRepository.countActivitiesWithResultByUser,
      ).toHaveBeenCalledWith(userId);
      expect(
        dashboardRepository.findUpcomingTasksByAssignedUser,
      ).toHaveBeenCalledWith(userId, now, 5);
      expect(
        dashboardRepository.findRecentActivitiesByUser,
      ).toHaveBeenCalledWith(userId, 5);
      expect(
        dashboardRepository.groupActivitiesByTypeForUser,
      ).toHaveBeenCalledWith(userId);
      expect(result.overview).toEqual({
        customersNeedingCare: 2,
        todayTasks: 1,
        pendingTasks: 3,
        overdueTasks: 1,
        completedActivities: 4,
      });
      expect(result.upcomingTasks[0]).toMatchObject({
        taskId: 15,
        title: 'Chăm sóc khách hàng',
        dealId: 7,
        dealName: 'Triển khai CRM',
        customer: 'Nguyễn Văn A',
      });
      expect(result.recentActivities[0]).toMatchObject({
        activityId: 20,
        activityType: 'Call',
        subject: 'Gọi chăm sóc khách hàng',
        dealId: 7,
        dealName: 'Triển khai CRM',
        customerId: 3,
        customer: 'Nguyễn Văn A',
        company: 'Công ty A',
      });
      expect(result.activitiesByType).toEqual([
        {
          activityType: 'Call',
          totalActivities: 3,
        },
        {
          activityType: 'Chưa xác định',
          totalActivities: 1,
        },
      ]);
    });
  });
});
