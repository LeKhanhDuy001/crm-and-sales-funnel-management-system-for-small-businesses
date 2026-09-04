export interface DashboardOverview {
  totalUsers: number;
  totalLeads: number;
  totalCustomers: number;
  totalDeals: number;
  totalProducts: number;
  totalQuotes: number;
  pendingTasks: number;
  totalRevenue: number;
}

export interface PipelineStage {
  stageId: number;
  stageName: string;
  stageOrder: number;
  totalDeals: number;
}

export interface RecentLead {
  leadId: number;
  fullName: string;
  company: string | null;
  email: string | null;
  status: string | null;
  source: string | null;
  assignedUser: string | null;
  createdDate: string | null;
}

export interface AdminDashboardData {
  overview: DashboardOverview;
  pipeline: PipelineStage[];
  recentLeads: RecentLead[];
}

export interface ForecastQuery {
  fromDate: string;
  toDate: string;
}

export interface ForecastData {
  fromDate: string;
  toDate: string;
  totalOpenDeals: number;
  pipelineValue: number;
  forecastRevenue: number;
}

export interface SalesManagerOverview {
  totalSales: number;
  openDeals: number;
  pipelineValue: number;
  expectedRevenue: number;
  wonRevenue: number;
  pendingTasks: number;
}

export interface SalesPerformance {
  userId: number;
  fullName: string;
  email: string;
  totalDeals: number;
  totalDealValue: number;
  expectedRevenue: number;
}

export interface AttentionDeal {
  dealId: number;
  dealName: string;
  dealValue: number;
  probability: number | null;
  expectedRevenue: number;
  expectedCloseDate: string | null;
  status: string | null;
  stage: string;
  assignedUser: string;
  customer: string;
  company: string | null;
}

export interface SalesManagerDashboardData {
  overview: SalesManagerOverview;
  pipeline: PipelineStage[];
  salesPerformance: SalesPerformance[];
  attentionDeals: AttentionDeal[];
}

export interface SalesOverview {
  totalLeads: number;
  totalDeals: number;
  pipelineValue: number;
  expectedRevenue: number;
  totalQuotes: number;
  pendingTasks: number;
}

export interface RecentDeal {
  dealId: number;
  dealName: string;
  dealValue: number;
  probability: number | null;
  expectedRevenue: number;
  expectedCloseDate: string | null;
  status: string | null;
  stage: string;
  customer: string;
  company: string | null;
}

export interface DashboardTask {
  taskId: number;
  title: string | null;
  priority: string | null;
  status: string | null;
  dueDate: string | null;
  dealId: number | null;
  dealName: string | null;
  customer: string | null;
}

export interface SalesDashboardData {
  overview: SalesOverview;
  pipeline: PipelineStage[];
  recentDeals: RecentDeal[];
  upcomingTasks: DashboardTask[];
}

export interface MarketingOverview {
  totalLeads: number;
  newLeadsThisMonth: number;
  convertedLeads: number;
  unconvertedLeads: number;
  conversionRate: number;
  totalLeadSources: number;
}

export interface LeadsBySource {
  sourceId: number;
  sourceName: string;
  totalLeads: number;
}

export interface LeadsByStatus {
  status: string;
  totalLeads: number;
}

export interface MarketingDashboardData {
  overview: MarketingOverview;
  leadsBySource: LeadsBySource[];
  leadsByStatus: LeadsByStatus[];
  recentLeads: RecentLead[];
}

export interface CustomerCareOverview {
  customersNeedingCare: number;
  todayTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completedActivities: number;
}

export interface RecentActivity {
  activityId: number;
  activityType: string | null;
  subject: string | null;
  activityTime: string | null;
  result: string | null;
  dealId: number;
  dealName: string;
  customerId: number;
  customer: string;
  company: string | null;
}

export interface ActivitiesByType {
  activityType: string;
  totalActivities: number;
}

export interface CustomerCareDashboardData {
  overview: CustomerCareOverview;
  upcomingTasks: DashboardTask[];
  recentActivities: RecentActivity[];
  activitiesByType: ActivitiesByType[];
}