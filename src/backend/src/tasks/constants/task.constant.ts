export const TASK_STATUS = {
  Pending: 'Pending',
  InProgress: 'InProgress',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
} as const;

export const TASK_STATUSES = Object.values(TASK_STATUS);

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export const TASK_PRIORITY = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
} as const;

export const TASK_PRIORITIES = Object.values(TASK_PRIORITY);

export type TaskPriority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];

export const TASK_NOTIFICATION_TYPE = 'Task';
