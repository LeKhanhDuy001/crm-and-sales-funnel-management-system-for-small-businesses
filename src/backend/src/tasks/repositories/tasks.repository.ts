import { Injectable } from '@nestjs/common';
import { action_type, Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { TaskQueryDto } from '../dto/task-query.dto';
import { TASK_NOTIFICATION_TYPE } from '../constants/task.constant';
import { TASK_STATUS } from '../constants/task.constant';

const taskSelect = {
  taskid: true,
  dealid: true,
  assigneduserid: true,
  title: true,
  description: true,
  duedate: true,
  remindertime: true,
  priority: true,
  status: true,

  users: {
    select: {
      userid: true,
      fullname: true,
      email: true,
      status: true,
      roles: {
        select: { rolename: true },
      },
    },
  },

  deals: {
    select: {
      dealid: true,
      dealname: true,
      assigneduserid: true,
      customers: {
        select: {
          customerid: true,
          fullname: true,
          company: true,
        },
      },
    },
  },
} satisfies Prisma.tasksSelect;

export type TaskWithRelations = Prisma.tasksGetPayload<{
  select: typeof taskSelect;
}>;

export interface TaskWriteData {
  dealId: number | null;
  assignedUserId: number;
  title: string;
  description: string | null;
  dueDate: Date;
  reminderTime: Date | null;
  priority: string;
  status: string;
}

export interface CreateTaskData extends TaskWriteData {
  actorUserId: number;
  notifyAssignee: boolean;
  ipAddress?: string;
}

export interface UpdateTaskData extends TaskWriteData {
  taskId: number;
  actorUserId: number;
  currentTask: TaskWithRelations;
  notifyAssignee: boolean;
  ipAddress?: string;
}

function taskAuditValue(task: TaskWithRelations) {
  return {
    dealId: task.dealid,
    assignedUserId: task.assigneduserid,
    title: task.title,
    dueDate: task.duedate?.toISOString() ?? null,
    reminderTime: task.remindertime?.toISOString() ?? null,
    priority: task.priority,
    status: task.status,
  };
}

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(
    query: TaskQueryDto,
    assignedUserId?: number,
  ): Prisma.tasksWhereInput {
    return {
      ...(assignedUserId !== undefined
        ? { assigneduserid: assignedUserId }
        : {}),
      ...(query.status
        ? { status: query.status }
        : { status: { not: TASK_STATUS.Cancelled } }),
      ...(query.priority ? { priority: query.priority } : {}),
      ...(query.search
        ? {
            OR: [
              {
                title: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: query.search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };
  }

  async findMany(
    query: TaskQueryDto,
    assignedUserId?: number,
  ): Promise<TaskWithRelations[]> {
    const skip = (query.page - 1) * query.limit;

    return this.prisma.tasks.findMany({
      where: this.buildWhere(query, assignedUserId),
      select: taskSelect,
      orderBy: { duedate: 'asc' },
      skip,
      take: query.limit,
    });
  }

  async count(query: TaskQueryDto, assignedUserId?: number): Promise<number> {
    return this.prisma.tasks.count({
      where: this.buildWhere(query, assignedUserId),
    });
  }

  async findVisibleById(
    taskId: number,
    assignedUserId?: number,
  ): Promise<TaskWithRelations | null> {
    return this.prisma.tasks.findFirst({
      where: {
        taskid: taskId,
        ...(assignedUserId !== undefined
          ? { assigneduserid: assignedUserId }
          : {}),
      },
      select: taskSelect,
    });
  }

  async findDealById(dealId: number) {
    return this.prisma.deals.findUnique({
      where: { dealid: dealId },
      select: {
        dealid: true,
        dealname: true,
        assigneduserid: true,
      },
    });
  }

  async findOwnedDealById(dealId: number, salesUserId: number) {
    return this.prisma.deals.findFirst({
      where: {
        dealid: dealId,
        assigneduserid: salesUserId,
      },
      select: {
        dealid: true,
        dealname: true,
      },
    });
  }

  async findActiveUserByRole(userId: number, roleName: string) {
    return this.prisma.users.findFirst({
      where: {
        userid: userId,
        status: true,

        roles: { rolename: roleName },
      },
      select: {
        userid: true,
        fullname: true,
        email: true,
      },
    });
  }

  async findActiveUsersByRole(roleName: string) {
    return this.prisma.users.findMany({
      where: {
        status: true,
        roles: { rolename: roleName },
      },
      select: {
        userid: true,
        fullname: true,
        email: true,
      },
      orderBy: { fullname: 'asc' },
    });
  }

  async findDealsForMeta(assignedUserId?: number) {
    return this.prisma.deals.findMany({
      where:
        assignedUserId !== undefined
          ? { assigneduserid: assignedUserId }
          : undefined,

      select: {
        dealid: true,
        dealname: true,

        customers: {
          select: {
            customerid: true,
            fullname: true,
            company: true,
          },
        },
      },

      orderBy: { dealname: 'asc' },
    });
  }

  async createWithAudit(input: CreateTaskData): Promise<TaskWithRelations> {
    return this.prisma.$transaction(async (transaction) => {
      const task = await transaction.tasks.create({
        data: {
          dealid: input.dealId,
          assigneduserid: input.assignedUserId,
          title: input.title,
          description: input.description,
          duedate: input.dueDate,
          remindertime: input.reminderTime,
          priority: input.priority,
          status: input.status,
        },
        select: taskSelect,
      });

      if (input.notifyAssignee) {
        await this.createTaskNotification(transaction, task);
      }

      await transaction.activitylogs.create({
        data: {
          userid: input.actorUserId,
          action: action_type.Create,
          tablename: 'tasks',
          recordid: task.taskid,
          ipaddress: input.ipAddress ?? null,
          newvalue: taskAuditValue(task),
        },
      });
      return task;
    });
  }

  async updateWithAudit(input: UpdateTaskData): Promise<TaskWithRelations> {
    return this.prisma.$transaction(async (transaction) => {
      const task = await transaction.tasks.update({
        where: {
          taskid: input.taskId,
        },
        data: {
          dealid: input.dealId,
          assigneduserid: input.assignedUserId,
          title: input.title,
          description: input.description,
          duedate: input.dueDate,
          remindertime: input.reminderTime,
          priority: input.priority,
          status: input.status,
        },
        select: taskSelect,
      });

      await transaction.activitylogs.create({
        data: {
          userid: input.actorUserId,
          action: action_type.Update,
          tablename: 'tasks',
          recordid: input.taskId,
          ipaddress: input.ipAddress ?? null,
          oldvalue: taskAuditValue(input.currentTask),
          newvalue: taskAuditValue(task),
        },
      });

      if (input.notifyAssignee) {
        await this.createTaskNotification(transaction, task);
      }
      return task;
    });
  }

  async updateStatusWithAudit(
    taskId: number,
    status: string,
    actorUserId: number,
    currentTask: TaskWithRelations,
    ipAddress?: string,
  ): Promise<TaskWithRelations> {
    return this.prisma.$transaction(async (transaction) => {
      const task = await transaction.tasks.update({
        where: { taskid: taskId },
        data: { status },
        select: taskSelect,
      });

      await transaction.activitylogs.create({
        data: {
          userid: actorUserId,
          action: action_type.Update,
          tablename: 'tasks',
          recordid: taskId,
          ipaddress: ipAddress ?? null,
          oldvalue: taskAuditValue(currentTask),
          newvalue: taskAuditValue(task),
        },
      });

      return task;
    });
  }

  private async createTaskNotification(
    transaction: Prisma.TransactionClient,
    task: TaskWithRelations,
  ): Promise<void> {
    if (!task.assigneduserid) {
      return;
    }

    // BR-14: Khi Task được phân công, hệ thống phải tạo Notification cho nhân viên được giao.
    await transaction.notifications.create({
      data: {
        userid: task.assigneduserid,
        title: 'Bạn có công việc mới',
        content: `Bạn được giao Task "${task.title ?? ''}".`,
        type: TASK_NOTIFICATION_TYPE,
        isread: false,
      },
    });
  }

  async assignWithAudit(
    taskId: number,
    assignedUserId: number,
    actorUserId: number,
    currentTask: { assigneduserid: number | null },
    ipAddress?: string,
  ) {
    return this.prisma.$transaction(async (transaction) => {
      const task = await transaction.tasks.update({
        where: { taskid: taskId },
        data: {
          assigneduserid: assignedUserId,
        },
        select: taskSelect,
      });

      // BR-14: Khi Task được phân công, người nhận Task phải được thông báo.
      await this.createTaskNotification(transaction, task);

      // BR-18: Thao tác phân công Task phải được ghi vào activity logs
      await transaction.activitylogs.create({
        data: {
          userid: actorUserId,
          action: action_type.Update,
          tablename: 'tasks',
          recordid: taskId,

          oldvalue: {
            assignedUserId: currentTask.assigneduserid,
          },

          newvalue: {
            assignedUserId,
          },

          ipaddress: ipAddress ?? null,
        },
      });
      return task;
    });
  }
}
