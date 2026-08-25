import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  TaskReminderRepository,
  type TaskReminderCandidate,
} from './repositories/task-reminder.repository';

@Injectable()
export class TaskReminderService {
  constructor(private readonly reminderRepository: TaskReminderRepository) {}

  /**
   * Kiểm tra Task tới thời gian nhắc và gửi Notification cho người phụ trách.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async processReminders(): Promise<void> {
    const now = new Date();
    const tasks = await this.reminderRepository.findDueReminders(now);

    for (const task of tasks) {
      await this.processTaskReminder(task, now);
    }
  }

  private async processTaskReminder(
    task: TaskReminderCandidate,
    now: Date,
  ): Promise<void> {
    const taskCode = `TK${String(task.taskId).padStart(3, '0')}`;
    const deadline = this.formatDeadline(task.dueDate);

    await this.reminderRepository.createReminder(
      task.taskId,
      task.assignedUserId,
      `Nhắc việc ${taskCode}`,
      `${task.title ?? 'Công việc'} sẽ đến hạn lúc ${deadline}.`,
      now,
    );
  }

  private formatDeadline(dueDate: Date | null): string {
    if (!dueDate) {
      return 'không xác định';
    }

    return new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dueDate);
  }
}
