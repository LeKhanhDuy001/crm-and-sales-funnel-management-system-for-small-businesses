import type { TaskPriority, TaskStatus, } from './tasks.types';

export function getTaskStatusLabel(status: TaskStatus | null,): string {
  switch (status) {
    case 'Pending':
      return 'Chờ thực hiện';
    case 'InProgress':
      return 'Đang thực hiện';
    case 'Completed':
      return 'Hoàn thành';
    case 'Cancelled':
      return 'Đã hủy';
    default:
      return 'Không xác định';
  }
}

export function getTaskPriorityLabel(priority: TaskPriority | null,): string {
  switch (priority) {
    case 'Low':
      return 'Thấp';
    case 'Medium':
      return 'Trung bình';
    case 'High':
      return 'Cao';
    default:
      return 'Không xác định';
  }
}