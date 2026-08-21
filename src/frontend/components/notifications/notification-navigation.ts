export function getNotificationPath(type: string | null,): string | null {
  switch (type) {
    case 'Task':
    case 'TaskReminder':
      return '/sales/tasks';
    default:
      return null;
  }
}