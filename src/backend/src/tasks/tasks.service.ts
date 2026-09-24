import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Role } from '../common/enums/role.enum';
import {
  TASK_PRIORITIES,
  TASK_PRIORITY,
  TASK_STATUSES,
  TASK_STATUS,
} from './constants/task.constant';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { TaskQueryDto } from './dto/task-query.dto';
import type { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import type { UpdateTaskDto } from './dto/update-task.dto';
import {
  type TaskWithRelations,
  type TaskWriteData,
  TasksRepository,
} from './repositories/tasks.repository';
import { AssignTaskDto } from './dto/assign-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  /**
   * Lấy danh sách Task theo quyền của người dùng.
   */
  async findAll(query: TaskQueryDto, user: AuthenticatedUser) {
    const assignedUserId = this.getVisibilityUserId(user);
    const [tasks, total] = await Promise.all([
      this.tasksRepository.findMany(query, assignedUserId),
      this.tasksRepository.count(query, assignedUserId),
    ]);

    return {
      data: tasks.map((task) => this.mapTask(task)),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  /**
   * Lấy chi tiết một Task nếu người dùng có quyền xem.
   */
  async findOne(taskId: number, user: AuthenticatedUser) {
    const task = await this.requireVisibleTask(taskId, user);
    return this.mapTask(task);
  }

  /**
   * Lấy dữ liệu hỗ trợ tạo và chỉnh sửa Task.
   */
  async getMeta(user: AuthenticatedUser) {
    const [deals, assignees] = await Promise.all([
      this.tasksRepository.findDealsForMeta(),
      this.getAssignees(user),
    ]);

    return {
      statuses: TASK_STATUSES,
      priorities: TASK_PRIORITIES,

      deals: deals.map((deal) => ({
        dealId: deal.dealid,
        dealName: deal.dealname,

        customer: {
          customerId: deal.customers.customerid,
          fullName: deal.customers.fullname,
          company: deal.customers.company,
        },
      })),

      assignees: assignees.map((assignee) => ({
        userId: assignee.userid,
        fullName: assignee.fullname,
        email: assignee.email,
      })),
    };
  }

  /**
   * Hủy Task thay cho xóa vật lý.
   */
  async cancel(taskId: number, user: AuthenticatedUser, ipAddress?: string) {
    const currentTask = await this.requireVisibleTask(taskId, user);

    if (currentTask.status === TASK_STATUS.Cancelled) {
      throw new ConflictException('Task này đã được hủy.');
    }

    // BR-45: Chỉ Task Pending mới được phép xóa.
    if (currentTask.status !== TASK_STATUS.Pending) {
      throw new UnprocessableEntityException(
        'Chỉ Task ở trạng thái Pending mới được phép xóa.',
      );
    }

    const task = await this.tasksRepository.updateStatusWithAudit(
      taskId,
      TASK_STATUS.Cancelled,
      user.userId,
      currentTask,
      ipAddress,
    );

    // BR-18: Hành động hủy Task vẫn phải được ghi lại trong Activity Log.
    return {
      message: 'Xóa Task thành công.',
      data: this.mapTask(task),
    };
  }

  /**
   * Tạo Task mới và gửi Notification cho người được giao.
   */
  async create(
    dto: CreateTaskDto,
    user: AuthenticatedUser,
    ipAddress?: string,
  ) {
    const assignedUserId = await this.resolveAssignee(dto.assignedUserId, user);
    const dealId = await this.resolveDeal(dto.dealId, user);
    const dates = this.validateDates(dto.dueDate, dto.reminderTime);

    // BR-13: Task phải có tiêu đề, người phụ trách, thời hạn hoàn thành và trạng thái.
    const task = await this.tasksRepository.createWithAudit({
      dealId,
      assignedUserId,
      title: this.requireTitle(dto.title),
      description: dto.description?.trim() || null,
      dueDate: dates.dueDate,
      reminderTime: dates.reminderTime,
      priority: dto.priority,
      status: TASK_STATUS.Pending,
      actorUserId: user.userId,
      notifyAssignee: assignedUserId !== user.userId,
      ipAddress,
    });

    // BR-18: Thao tác tạo Task phải được ghi vào Activity Log.
    return {
      message: 'Tạo Task thành công.',
      data: this.mapTask(task),
    };
  }

  /**
   * Cập nhật nội dung Task mà người dùng có quyền quản lý.
   */
  async update(
    taskId: number,
    dto: UpdateTaskDto,
    user: AuthenticatedUser,
    ipAddress?: string,
  ) {
    const currentTask = await this.requireVisibleTask(taskId, user);

    // BR-47: Chỉ Task Pending mới được phép chỉnh sửa.
    if (currentTask.status !== TASK_STATUS.Pending) {
      throw new UnprocessableEntityException(
        'Chỉ Task ở trạng thái Pending mới được phép chỉnh sửa.',
      );
    }

    const taskData = await this.buildUpdateData(currentTask, dto, user);
    const notifyAssignee =
      currentTask.assigneduserid !== taskData.assignedUserId;
    const task = await this.tasksRepository.updateWithAudit({
      taskId,
      ...taskData,
      actorUserId: user.userId,
      currentTask,
      notifyAssignee,
      ipAddress,
    });

    return {
      message: 'Cập nhật Task thành công.',
      data: this.mapTask(task),
    };
  }

  /**
   * Cập nhật trạng thái của Task.
   */
  async updateStatus(
    taskId: number,
    dto: UpdateTaskStatusDto,
    user: AuthenticatedUser,
    ipAddress?: string,
  ) {
    const currentTask = await this.requireVisibleTask(taskId, user);

    // BR-45: Task đã Cancelled không được thay đổi trạng thái.
    if (currentTask.status === TASK_STATUS.Cancelled) {
      throw new ConflictException(
        'Task đã bị hủy nên không thể thay đổi trạng thái.',
      );
    }

    // BR-45: Cancelled chỉ được thực hiện thông qua chức năng xóa Task.
    if (dto.status === TASK_STATUS.Cancelled) {
      throw new UnprocessableEntityException(
        'Không thể chuyển trực tiếp Task sang trạng thái Cancelled.',
      );
    }

    // BR-46: Task phải chuyển trạng thái theo đúng luồng Pending -> InProgress -> Completed.
    this.validateStatusTransition(currentTask.status, dto.status);

    const task = await this.tasksRepository.updateStatusWithAudit(
      taskId,
      dto.status,
      user.userId,
      currentTask,
      ipAddress,
    );

    // BR-18: Thay đổi trạng thái Task phải được ghi vào Activity Log.
    return {
      message: 'Cập nhật trạng thái Task thành công.',
      data: this.mapTask(task),
    };
  }

  private validateStatusTransition(
    currentStatus: string | null,
    nextStatus: string,
  ): void {
    if (
      currentStatus === TASK_STATUS.Pending &&
      nextStatus === TASK_STATUS.Completed
    ) {
      throw new UnprocessableEntityException(
        'Task ở trạng thái Chờ thực hiện phải chuyển sang Đang thực hiện trước khi hoàn thành.',
      );
    }

    if (
      currentStatus === TASK_STATUS.InProgress &&
      nextStatus === TASK_STATUS.Pending
    ) {
      throw new UnprocessableEntityException(
        'Task đang thực hiện không được chuyển về trạng thái Chờ thực hiện.',
      );
    }

    if (
      currentStatus === TASK_STATUS.Completed &&
      (nextStatus === TASK_STATUS.InProgress ||
        nextStatus === TASK_STATUS.Pending)
    ) {
      throw new UnprocessableEntityException(
        'Task đã hoàn thành không được chuyển về trạng thái trước đó.',
      );
    }
  }

  private getVisibilityUserId(user: AuthenticatedUser): number | undefined {
    if (user.role === Role.SALES_MANAGER) {
      return undefined;
    }
    return user.userId;
  }

  private async requireVisibleTask(
    taskId: number,
    user: AuthenticatedUser,
  ): Promise<TaskWithRelations> {
    const task = await this.tasksRepository.findVisibleById(
      taskId,
      this.getVisibilityUserId(user),
    );

    if (!task) {
      throw new NotFoundException('Không tìm thấy Task.');
    }

    return task;
  }

  private async resolveAssignee(
    requestedUserId: number | undefined,
    user: AuthenticatedUser,
  ): Promise<number> {
    if (user.role === Role.CUSTOMER_CARE) {
      if (requestedUserId && requestedUserId !== user.userId) {
        throw new ForbiddenException(
          'Customer Care chỉ được tạo Task cho chính mình.',
        );
      }
      return user.userId;
    }

    if (user.role !== Role.SALES_MANAGER) {
      throw new ForbiddenException('Bạn không có quyền phân công Task.');
    }

    if (!requestedUserId) {
      throw new UnprocessableEntityException(
        'Vui lòng chọn nhân viên Sales thực hiện Task.',
      );
    }

    const sales = await this.tasksRepository.findActiveUserByRole(
      requestedUserId,
      Role.SALES,
    );

    // BR-14: Sales Manager chỉ được phân công Task cho nhân viên Sales đang hoạt động.
    if (!sales) {
      throw new UnprocessableEntityException(
        'Nhân viên Sales không tồn tại hoặc đã bị khóa.',
      );
    }
    return sales.userid;
  }

  private async resolveDeal(
    dealId: number | undefined,
    user: AuthenticatedUser,
  ): Promise<number | null> {
    if (!dealId) {
      return null;
    }

    const deal =
      user.role === Role.SALES
        ? await this.tasksRepository.findOwnedDealById(dealId, user.userId)
        : await this.tasksRepository.findDealById(dealId);

    if (!deal) {
      throw new NotFoundException(
        'Không tìm thấy Deal hoặc bạn không có quyền trên Deal này.',
      );
    }
    return deal.dealid;
  }

  private validateDates(dueDateValue: string, reminderValue?: string) {
    const now = new Date();
    const dueDate = new Date(dueDateValue);
    const reminderTime = reminderValue ? new Date(reminderValue) : null;

    // BR-13: Thời hạn hoàn thành phải lớn hơn thời điểm hiện tại.
    if (dueDate <= now) {
      throw new UnprocessableEntityException(
        'Thời hạn hoàn thành phải lớn hơn thời điểm hiện tại.',
      );
    }
    this.validateReminder(reminderTime, dueDate, now);
    return { dueDate, reminderTime };
  }

  private validateReminder(
    reminderTime: Date | null,
    dueDate: Date,
    now: Date,
  ): void {
    if (!reminderTime) {
      return;
    }

    if (reminderTime <= now) {
      throw new UnprocessableEntityException(
        'Thời gian nhắc việc phải lớn hơn thời điểm hiện tại.',
      );
    }

    if (reminderTime > dueDate) {
      throw new UnprocessableEntityException(
        'Thời gian nhắc việc không được sau thời hạn hoàn thành.',
      );
    }
  }

  private requireTitle(title: string | null): string {
    const normalizedTitle = title?.trim() ?? '';
    if (!normalizedTitle) {
      throw new UnprocessableEntityException(
        'Tiêu đề Task không được để trống.',
      );
    }
    return normalizedTitle;
  }

  private async getAssignees(user: AuthenticatedUser) {
    if (user.role === Role.SALES_MANAGER) {
      return this.tasksRepository.findActiveUsersByRole(Role.SALES);
    }

    if (user.role === Role.CUSTOMER_CARE) {
      return [
        {
          userid: user.userId,
          fullname: user.fullName,
          email: user.email,
        },
      ];
    }
    throw new ForbiddenException('Bạn không có quyền tạo hoặc chỉnh sửa Task.');
  }

  private async buildUpdateData(
    task: TaskWithRelations,
    dto: UpdateTaskDto,
    user: AuthenticatedUser,
  ): Promise<TaskWriteData> {
    const assignedUserId = await this.resolveAssignee(
      dto.assignedUserId ?? task.assigneduserid ?? undefined,
      user,
    );

    const dealId =
      dto.dealId !== undefined
        ? await this.resolveDeal(dto.dealId, user)
        : task.dealid;

    const title = this.requireTitle(dto.title ?? task.title);

    if (!task.duedate && !dto.dueDate) {
      throw new UnprocessableEntityException(
        'Task phải có thời hạn hoàn thành.',
      );
    }

    const dates = this.validateDates(
      dto.dueDate ?? task.duedate!.toISOString(),
      dto.reminderTime ?? task.remindertime?.toISOString(),
    );

    return {
      dealId,
      assignedUserId,
      title,
      description: dto.description?.trim() ?? task.description,
      dueDate: dates.dueDate,
      reminderTime: dates.reminderTime,
      priority: dto.priority ?? task.priority ?? TASK_PRIORITY.Medium,
      status: task.status ?? TASK_STATUS.Pending,
    };
  }

  private mapTask(task: TaskWithRelations) {
    return {
      taskId: task.taskid,
      taskCode: `TK${String(task.taskid).padStart(3, '0')}`,
      title: task.title,
      description: task.description,
      dueDate: task.duedate,
      reminderTime: task.remindertime,
      priority: task.priority,
      status: task.status,
      assignedUser: task.users
        ? {
            userId: task.users.userid,
            fullName: task.users.fullname,
            email: task.users.email,
            role: task.users.roles.rolename,
          }
        : null,

      deal: task.deals
        ? {
            dealId: task.deals.dealid,
            dealName: task.deals.dealname,
            customer: {
              customerId: task.deals.customers.customerid,
              fullName: task.deals.customers.fullname,
              company: task.deals.customers.company,
            },
          }
        : null,
    };
  }

  /**
   * Phân công một Task cho nhân viên Sales. Chỉ Sales Manager được thực hiện.
   */
  async assign(
    taskId: number,
    dto: AssignTaskDto,
    user: AuthenticatedUser,
    ipAddress?: string,
  ) {
    if (user.role !== Role.SALES_MANAGER) {
      throw new ForbiddenException('Bạn không có quyền phân công Task.');
    }

    const currentTask = await this.requireVisibleTask(taskId, user);

    // BR-47: Chỉ Task Pending mới được phép phân công lại.
    if (currentTask.status !== TASK_STATUS.Pending) {
      throw new UnprocessableEntityException(
        'Chỉ Task ở trạng thái Pending mới được phép phân công.',
      );
    }

    const assignedUserId = await this.resolveAssignee(dto.assignedUserId, user);

    if (currentTask.assigneduserid === assignedUserId) {
      throw new ConflictException('Task đã được phân công cho nhân viên này.');
    }

    const task = await this.tasksRepository.assignWithAudit(
      taskId,
      assignedUserId,
      user.userId,
      currentTask,
      ipAddress,
    );

    return {
      message: 'Phân công Task thành công.',
      data: this.mapTask(task),
    };
  }
}
