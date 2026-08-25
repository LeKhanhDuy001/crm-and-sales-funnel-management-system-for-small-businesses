export type ActivityLogAction =
  | 'Login'
  | 'Logout'
  | 'Create'
  | 'Update'
  | 'Delete'
  | 'Assign'
  | 'Convert'
  | 'Send_Quote'
  | 'Change_Stage';

export interface ActivityLogUser {
  userId: number;
  fullName: string;
  email: string;
}

export interface ActivityLogItem {
  logId: number;
  user: ActivityLogUser | null;
  action: ActivityLogAction | null;
  tableName: string | null;
  recordId: number | null;
  actionTime: string | null;
  ipAddress: string | null;
  oldValue: unknown;
  newValue: unknown;
}

export interface ActivityLogsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ActivityLogsResponse {
  data: ActivityLogItem[];
  pagination: ActivityLogsPagination;
}

export interface ActivityLogFilterUsersResponse {
  data: ActivityLogUser[];
}

export interface ActivityLogQuery {
  userId?: number;
  action?: ActivityLogAction;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface ActivityLogFilterValues {
  userId: string;
  action: string;
  fromDate: string;
  toDate: string;
}