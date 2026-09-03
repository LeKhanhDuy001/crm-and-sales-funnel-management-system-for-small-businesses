export type ActivityType = | 'Call' | 'Email' | 'Meeting';

export interface ActivityUser {
  userId: number;
  fullName: string;
  email: string;
}

export interface ActivityDeal {
  dealId: number;
  dealName: string;
}

export interface ActivityCustomer {
  customerId: number;
  fullName: string;
  company: string | null;
}

export interface ActivityDealOption {
  dealId: number;
  dealName: string;
  customer: ActivityCustomer;
}

export interface ActivityMetaResponse {
  deals: ActivityDealOption[];
}

export interface Activity {
  activityId: number;
  activityCode: string;
  activityType: ActivityType;
  subject: string;
  description: string;
  activityTime: string;
  result: string | null;
  status: ActivityStatus;
  user: ActivityUser;
  deal: ActivityDeal;
  customer: ActivityCustomer;
}

export interface ActivitiesResponse {
  data: Activity[];
}

export interface CreateActivityInput {
  dealId: number;
  activityType: ActivityType;
  subject: string;
  description: string;
  activityTime: string;
}

export interface ActivityMutationResponse {
  message: string;
  data: Activity;
}

export interface UpdateActivityResultInput {
  result: string;
}

export type ActivityStatus = | 'Pending' | 'Completed' | 'Cancelled';