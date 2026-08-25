export type TaskStatus = | 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';

export type TaskPriority = | 'Low' | 'Medium' | 'High';

export interface TaskAssignedUser {
  userId: number;
  fullName: string;
  email: string;
  role: string;
}

export interface TaskCustomer {
  customerId: number;
  fullName: string;
  company: string | null;
}

export interface TaskDeal {
  dealId: number;
  dealName: string;
  customer: TaskCustomer;
}

export interface Task {
  taskId: number;
  taskCode: string;
  title: string | null;
  description: string | null;
  dueDate: string | null;
  reminderTime: string | null;
  priority: TaskPriority | null;
  status: TaskStatus | null;
  assignedUser: TaskAssignedUser | null;
  deal: TaskDeal | null;
}

export interface TaskPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TaskQuery {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  page?: number;
  limit?: number;
}

export interface TasksResponse {
  data: Task[];
  pagination: TaskPagination;
}

export interface TaskMetaDeal {
  dealId: number;
  dealName: string;
  customer: TaskCustomer;
}

export interface TaskAssignee {
  userId: number;
  fullName: string;
  email: string;
}

export interface TaskMetaResponse {
  statuses: TaskStatus[];
  priorities: TaskPriority[];
  deals: TaskMetaDeal[];
  assignees: TaskAssignee[];
}

export interface CreateTaskInput {
  dealId?: number;
  assignedUserId?: number;
  title: string;
  description?: string;
  dueDate: string;
  reminderTime?: string;
  priority: TaskPriority;
}

export interface UpdateTaskInput {
  dealId?: number;
  assignedUserId?: number;
  title?: string;
  description?: string;
  dueDate?: string;
  reminderTime?: string;
  priority?: TaskPriority;
}

export interface UpdateTaskStatusInput {
  status: TaskStatus;
}

export interface TaskMutationResponse {
  message: string;
  data: Task;
}

export interface AssignTaskInput {
  assignedUserId: number;
}