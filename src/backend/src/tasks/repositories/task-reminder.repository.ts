import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface TaskReminderCandidate {
  taskId: number;
  assignedUserId: number;
  title: string | null;
  dueDate: Date | null;
}

@Injectable()
export class TaskReminderRepository {
  constructor(private readonly prisma: PrismaService) {}

  findDueReminders(now: Date): Promise<TaskReminderCandidate[]> {
    return this.prisma.tasks
      .findMany({
        where: {
          remindertime: {
            lte: now,
          },
          remindedat: null,
          assigneduserid: { not: null },
          status: {
            notIn: ['Completed', 'Cancelled'],
          },
        },
        select: {
          taskid: true,
          assigneduserid: true,
          title: true,
          duedate: true,
        },
        orderBy: { remindertime: 'asc' },
      })
      .then((tasks) =>
        tasks
          .filter(
            (
              task,
            ): task is typeof task & {
              assigneduserid: number;
            } => task.assigneduserid !== null,
          )
          .map((task) => ({
            taskId: task.taskid,
            assignedUserId: task.assigneduserid,
            title: task.title,
            dueDate: task.duedate,
          })),
      );
  }

  async createReminder(
    taskId: number,
    userId: number,
    title: string,
    content: string,
    remindedAt: Date,
  ): Promise<boolean> {
    return this.prisma.$transaction(async (transaction) => {
      const result = await transaction.tasks.updateMany({
        where: {
          taskid: taskId,
          remindedat: null,
        },

        data: {
          remindedat: remindedAt,
        },
      });

      if (result.count === 0) {
        return false;
      }

      await transaction.notifications.create({
        data: {
          userid: userId,
          title,
          content,
          type: 'TaskReminder',
          isread: false,
        },
      });

      return true;
    });
  }
}
