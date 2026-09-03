import type { ActivityStatus, ActivityType, } from '../../modules/activities/activities.types';

export function getActivityTypeLabel(type: ActivityType,): string {
  switch (type) {
    case 'Call':
      return 'Gọi điện';
    case 'Email':
      return 'Email';
    case 'Meeting':
      return 'Cuộc hẹn';
    default:
      return type;
  }
}

export function getActivityStatusLabel(status: ActivityStatus,): string {
  switch (status) {
    case 'Pending':
      return 'Chờ thực hiện';
    case 'Completed':
      return 'Hoàn thành';
    case 'Cancelled':
      return 'Đã hủy';
    default:
      return status;
  }
}

export function formatActivityDate(value: string): string {
  return new Date(value).toLocaleString('vi-VN');
}