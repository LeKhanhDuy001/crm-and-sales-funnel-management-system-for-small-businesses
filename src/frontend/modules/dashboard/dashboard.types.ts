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