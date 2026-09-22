import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Role } from '../common/enums/role.enum';
import { TASK_PRIORITY, TASK_STATUS } from './constants/task.constant';
import {
  type TaskWithRelations,
  TasksRepository,
} from './repositories/tasks.repository';
import { TasksService } from './tasks.service';

type TasksRepositoryMock = {
  findMany: jest.MockedFunction<TasksRepository['findMany']>;
  count: jest.MockedFunction<TasksRepository['count']>;
  findVisibleById: jest.MockedFunction<TasksRepository['findVisibleById']>;
  findDealById: jest.MockedFunction<TasksRepository['findDealById']>;
  findOwnedDealById: jest.MockedFunction<TasksRepository['findOwnedDealById']>;
  findActiveUserByRole: jest.MockedFunction<
    TasksRepository['findActiveUserByRole']
  >;
  findActiveUsersByRole: jest.MockedFunction<
    TasksRepository['findActiveUsersByRole']
  >;
  findDealsForMeta: jest.MockedFunction<TasksRepository['findDealsForMeta']>;
  createWithAudit: jest.MockedFunction<TasksRepository['createWithAudit']>;
  updateWithAudit: jest.MockedFunction<TasksRepository['updateWithAudit']>;
  updateStatusWithAudit: jest.MockedFunction<
    TasksRepository['updateStatusWithAudit']
  >;
  assignWithAudit: jest.MockedFunction<TasksRepository['assignWithAudit']>;
};

const FUTURE_DUE = '2099-01-02T10:00:00.000Z';
const FUTURE_REMINDER = '2099-01-01T10:00:00.000Z';
const IP_ADDRESS = '127.0.0.1';

function makeUser(
  role: Role,
  userId: number,
  fullName = 'Người dùng Demo',
): AuthenticatedUser {
  return {
    userId,
    fullName,
    email: `user${userId}@crm.local`,
    role,
  };
}

function makeTask(
  overrides: Partial<TaskWithRelations> = {},
): TaskWithRelations {
  const task: TaskWithRelations = {
    taskid: 1,
    dealid: 10,
    assigneduserid: 2,
    title: 'Gọi điện khách hàng',
    description: 'Trao đổi nhu cầu khách hàng',
    duedate: new Date(FUTURE_DUE),
    remindertime: new Date(FUTURE_REMINDER),
    priority: TASK_PRIORITY.Medium,
    status: TASK_STATUS.Pending,
    users: {
      userid: 2,
      fullname: 'Sales Demo',
      email: 'sales.demo@crm.local',
      status: true,
      roles: { rolename: Role.SALES },
    },

    deals: {
      dealid: 10,
      dealname: 'Deal Demo',
      assigneduserid: 2,
      customers: {
        customerid: 20,
        fullname: 'Khách hàng Demo',
        company: 'Công ty Demo',
      },
    },
  };
  return {
    ...task,
    ...overrides,
  };
}

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: TasksRepositoryMock;
  const manager = makeUser(Role.SALES_MANAGER, 1, 'Sales Manager');
  const sales = makeUser(Role.SALES, 2, 'Sales Demo');
  const customerCare = makeUser(Role.CUSTOMER_CARE, 3, 'Customer Care');

  beforeEach(() => {
    tasksRepository = {
      findMany: jest.fn(),
      count: jest.fn(),
      findVisibleById: jest.fn(),
      findDealById: jest.fn(),
      findOwnedDealById: jest.fn(),
      findActiveUserByRole: jest.fn(),
      findActiveUsersByRole: jest.fn(),
      findDealsForMeta: jest.fn(),
      createWithAudit: jest.fn(),
      updateWithAudit: jest.fn(),
      updateStatusWithAudit: jest.fn(),
      assignWithAudit: jest.fn(),
    };
    tasksService = new TasksService(
      tasksRepository as unknown as TasksRepository,
    );
  });

  function mockActiveSales(userId = 2): void {
    tasksRepository.findActiveUserByRole.mockResolvedValue({
      userid: userId,
      fullname: `Sales ${userId}`,
      email: `sales${userId}@crm.local`,
    });
  }

  describe('findAll', () => {
    it('Sales Manager xem toàn bộ Task', async () => {
      const query = { page: 1, limit: 20 };
      tasksRepository.findMany.mockResolvedValue([makeTask()]);
      tasksRepository.count.mockResolvedValue(1);
      const result = await tasksService.findAll(query, manager);
      expect(tasksRepository.findMany).toHaveBeenCalledWith(query, undefined);
      expect(tasksRepository.count).toHaveBeenCalledWith(query, undefined);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
      expect(result.data).toHaveLength(1);
    });

    it.each([
      ['Sales', sales],
      ['Customer Care', customerCare],
    ])('%s chỉ xem Task được giao cho chính mình', async (_, user) => {
      const query = {
        search: 'khách',
        status: TASK_STATUS.Pending,
        priority: TASK_PRIORITY.Medium,
        page: 2,
        limit: 10,
      };
      tasksRepository.findMany.mockResolvedValue([]);
      tasksRepository.count.mockResolvedValue(0);
      const result = await tasksService.findAll(query, user);
      expect(tasksRepository.findMany).toHaveBeenCalledWith(query, user.userId);
      expect(tasksRepository.count).toHaveBeenCalledWith(query, user.userId);
      expect(result.pagination.totalPages).toBe(0);
    });
  });
  describe('findOne', () => {
    it('trả chi tiết Task thuộc quyền của Sales', async () => {
      tasksRepository.findVisibleById.mockResolvedValue(makeTask());
      const result = await tasksService.findOne(1, sales);
      expect(tasksRepository.findVisibleById).toHaveBeenCalledWith(1, 2);
      expect(result.taskId).toBe(1);
      expect(result.taskCode).toBe('TK001');
      expect(result.assignedUser?.userId).toBe(2);
      expect(result.deal?.dealId).toBe(10);
    });

    it('ném NotFoundException khi Task không thuộc quyền xem', async () => {
      tasksRepository.findVisibleById.mockResolvedValue(null);
      await expect(tasksService.findOne(99, sales)).rejects.toThrow(
        NotFoundException,
      );
      expect(tasksRepository.findVisibleById).toHaveBeenCalledWith(99, 2);
    });
  });

  describe('getMeta', () => {
    it('Sales Manager lấy Deal và danh sách Sales đang hoạt động', async () => {
      tasksRepository.findDealsForMeta.mockResolvedValue([
        {
          dealid: 10,
          dealname: 'Deal Demo',
          customers: {
            customerid: 20,
            fullname: 'Khách hàng Demo',
            company: 'Công ty Demo',
          },
        },
      ]);
      tasksRepository.findActiveUsersByRole.mockResolvedValue([
        {
          userid: 2,
          fullname: 'Sales Demo',
          email: 'sales.demo@crm.local',
        },
      ]);
      const result = await tasksService.getMeta(manager);

      expect(tasksRepository.findActiveUsersByRole).toHaveBeenCalledWith(
        Role.SALES,
      );
      expect(result.deals[0].dealId).toBe(10);
      expect(result.assignees[0].userId).toBe(2);
      expect(result.statuses).toBeDefined();
      expect(result.priorities).toBeDefined();
    });

    it('Customer Care chỉ nhận chính mình trong danh sách assignee', async () => {
      tasksRepository.findDealsForMeta.mockResolvedValue([]);
      const result = await tasksService.getMeta(customerCare);

      expect(result.assignees).toEqual([
        {
          userId: 3,
          fullName: 'Customer Care',
          email: 'user3@crm.local',
        },
      ]);
      expect(tasksRepository.findActiveUsersByRole).not.toHaveBeenCalled();
    });

    it('Sales không được lấy meta tạo hoặc chỉnh sửa Task', async () => {
      tasksRepository.findDealsForMeta.mockResolvedValue([]);
      await expect(tasksService.getMeta(sales)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('create', () => {
    it('Sales Manager tạo Task hợp lệ và phân công cho Sales', async () => {
      mockActiveSales(2);
      tasksRepository.findDealById.mockResolvedValue({
        dealid: 10,
        dealname: 'Deal Demo',
        assigneduserid: 2,
      });
      tasksRepository.createWithAudit.mockResolvedValue(makeTask());
      const result = await tasksService.create(
        {
          dealId: 10,
          assignedUserId: 2,
          title: '  Gọi điện khách hàng  ',
          description: '  Trao đổi nhu cầu  ',
          dueDate: FUTURE_DUE,
          reminderTime: FUTURE_REMINDER,
          priority: TASK_PRIORITY.Medium,
        },
        manager,
        IP_ADDRESS,
      );
      expect(tasksRepository.createWithAudit).toHaveBeenCalledWith({
        dealId: 10,
        assignedUserId: 2,
        title: 'Gọi điện khách hàng',
        description: 'Trao đổi nhu cầu',
        dueDate: new Date(FUTURE_DUE),
        reminderTime: new Date(FUTURE_REMINDER),
        priority: TASK_PRIORITY.Medium,
        status: TASK_STATUS.Pending,
        actorUserId: 1,
        notifyAssignee: true,
        ipAddress: IP_ADDRESS,
      });
      expect(result.message).toBe('Tạo Task thành công.');
    });
    it('Customer Care tạo Task cho chính mình', async () => {
      const task = makeTask({
        dealid: null,
        assigneduserid: 3,
        deals: null,
        users: {
          userid: 3,
          fullname: 'Customer Care',
          email: 'user3@crm.local',
          status: true,
          roles: { rolename: Role.CUSTOMER_CARE },
        },
      });
      tasksRepository.createWithAudit.mockResolvedValue(task);
      await tasksService.create(
        {
          title: 'Chăm sóc khách hàng',
          dueDate: FUTURE_DUE,
          priority: TASK_PRIORITY.Medium,
        },
        customerCare,
        IP_ADDRESS,
      );

      expect(tasksRepository.createWithAudit).toHaveBeenCalledWith(
        expect.objectContaining({
          assignedUserId: 3,
          dealId: null,
          status: TASK_STATUS.Pending,
          notifyAssignee: false,
          actorUserId: 3,
        }),
      );

      expect(tasksRepository.findActiveUserByRole).not.toHaveBeenCalled();
    });

    it('Customer Care không được tạo Task cho người khác', async () => {
      await expect(
        tasksService.create(
          {
            assignedUserId: 2,
            title: 'Task',
            dueDate: FUTURE_DUE,
            priority: TASK_PRIORITY.Medium,
          },
          customerCare,
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(tasksRepository.createWithAudit).not.toHaveBeenCalled();
    });

    it('Sales Manager phải chọn Sales thực hiện Task', async () => {
      await expect(
        tasksService.create(
          {
            title: 'Task',
            dueDate: FUTURE_DUE,
            priority: TASK_PRIORITY.Medium,
          },
          manager,
        ),
      ).rejects.toThrow(UnprocessableEntityException);
      expect(tasksRepository.createWithAudit).not.toHaveBeenCalled();
    });

    it('không cho phân công cho Sales không tồn tại hoặc đã khóa', async () => {
      tasksRepository.findActiveUserByRole.mockResolvedValue(null);
      await expect(
        tasksService.create(
          {
            assignedUserId: 99,
            title: 'Task',
            dueDate: FUTURE_DUE,
            priority: TASK_PRIORITY.Medium,
          },
          manager,
        ),
      ).rejects.toThrow(UnprocessableEntityException);
      expect(tasksRepository.createWithAudit).not.toHaveBeenCalled();
    });

    it('không tạo Task khi Deal không tồn tại', async () => {
      mockActiveSales();
      tasksRepository.findDealById.mockResolvedValue(null);
      await expect(
        tasksService.create(
          {
            dealId: 99,
            assignedUserId: 2,
            title: 'Task',
            dueDate: FUTURE_DUE,
            priority: TASK_PRIORITY.Medium,
          },
          manager,
        ),
      ).rejects.toThrow(NotFoundException);
      expect(tasksRepository.createWithAudit).not.toHaveBeenCalled();
    });

    it('BR13 - không cho deadline ở quá khứ', async () => {
      mockActiveSales();
      await expect(
        tasksService.create(
          {
            assignedUserId: 2,
            title: 'Task',
            dueDate: '2000-01-01T10:00:00.000Z',
            priority: TASK_PRIORITY.Medium,
          },
          manager,
        ),
      ).rejects.toThrow(UnprocessableEntityException);
      expect(tasksRepository.createWithAudit).not.toHaveBeenCalled();
    });
    it('BR13 - không cho reminder ở quá khứ', async () => {
      mockActiveSales();
      await expect(
        tasksService.create(
          {
            assignedUserId: 2,
            title: 'Task',
            dueDate: FUTURE_DUE,
            reminderTime: '2000-01-01T10:00:00.000Z',
            priority: TASK_PRIORITY.Medium,
          },
          manager,
        ),
      ).rejects.toThrow(UnprocessableEntityException);
      expect(tasksRepository.createWithAudit).not.toHaveBeenCalled();
    });
    it('BR13 - không cho reminder sau deadline', async () => {
      mockActiveSales();
      await expect(
        tasksService.create(
          {
            assignedUserId: 2,
            title: 'Task',
            dueDate: '2099-01-01T10:00:00.000Z',
            reminderTime: '2099-01-02T10:00:00.000Z',
            priority: TASK_PRIORITY.Medium,
          },
          manager,
        ),
      ).rejects.toThrow(UnprocessableEntityException);
      expect(tasksRepository.createWithAudit).not.toHaveBeenCalled();
    });
    it('BR13 - không cho tiêu đề chỉ chứa khoảng trắng', async () => {
      mockActiveSales();
      await expect(
        tasksService.create(
          {
            assignedUserId: 2,
            title: '   ',
            dueDate: FUTURE_DUE,
            priority: TASK_PRIORITY.Medium,
          },
          manager,
        ),
      ).rejects.toThrow(UnprocessableEntityException);
      expect(tasksRepository.createWithAudit).not.toHaveBeenCalled();
    });
  });
  describe('update', () => {
    it('cập nhật Task hợp lệ và giữ assignee hiện tại', async () => {
      const currentTask = makeTask();
      const updatedTask = makeTask({
        title: 'Task đã cập nhật',
        description: 'Nội dung mới',
      });
      tasksRepository.findVisibleById.mockResolvedValue(currentTask);
      mockActiveSales(2);
      tasksRepository.updateWithAudit.mockResolvedValue(updatedTask);
      const result = await tasksService.update(
        1,
        {
          title: '  Task đã cập nhật  ',
          description: '  Nội dung mới  ',
        },
        manager,
        IP_ADDRESS,
      );
      expect(tasksRepository.updateWithAudit).toHaveBeenCalledWith(
        expect.objectContaining({
          taskId: 1,
          dealId: 10,
          assignedUserId: 2,
          title: 'Task đã cập nhật',
          description: 'Nội dung mới',
          notifyAssignee: false,
          actorUserId: 1,
          currentTask,
          ipAddress: IP_ADDRESS,
        }),
      );
      expect(result.message).toBe('Cập nhật Task thành công.');
    });
    it('đổi assignee khi cập nhật thì yêu cầu gửi Notification', async () => {
      const currentTask = makeTask();
      const updatedTask = makeTask({
        assigneduserid: 3,
        users: {
          userid: 3,
          fullname: 'Sales 3',
          email: 'sales3@crm.local',
          status: true,
          roles: { rolename: Role.SALES },
        },
      });
      tasksRepository.findVisibleById.mockResolvedValue(currentTask);
      mockActiveSales(3);
      tasksRepository.updateWithAudit.mockResolvedValue(updatedTask);
      await tasksService.update(
        1,
        {
          assignedUserId: 3,
        },
        manager,
        IP_ADDRESS,
      );
      expect(tasksRepository.updateWithAudit).toHaveBeenCalledWith(
        expect.objectContaining({
          assignedUserId: 3,
          notifyAssignee: true,
        }),
      );
    });

    it('BR13 - Task không có deadline thì không được cập nhật', async () => {
      const currentTask = makeTask({
        duedate: null,
        remindertime: null,
      });
      tasksRepository.findVisibleById.mockResolvedValue(currentTask);
      mockActiveSales(2);
      await expect(
        tasksService.update(
          1,
          {
            title: 'Cập nhật',
          },
          manager,
        ),
      ).rejects.toThrow(UnprocessableEntityException);
      expect(tasksRepository.updateWithAudit).not.toHaveBeenCalled();
    });
    it('không cập nhật Task không thuộc quyền quản lý', async () => {
      tasksRepository.findVisibleById.mockResolvedValue(null);
      await expect(
        tasksService.update(
          99,
          {
            title: 'Cập nhật',
          },
          customerCare,
        ),
      ).rejects.toThrow(NotFoundException);
      expect(tasksRepository.updateWithAudit).not.toHaveBeenCalled();
    });
  });
  describe('updateStatus', () => {
    it('BR18 - cập nhật trạng thái Task qua Repository có Audit Log', async () => {
      const currentTask = makeTask();
      const updatedTask = makeTask({
        status: TASK_STATUS.Completed,
      });
      tasksRepository.findVisibleById.mockResolvedValue(currentTask);
      tasksRepository.updateStatusWithAudit.mockResolvedValue(updatedTask);
      const result = await tasksService.updateStatus(
        1,
        {
          status: TASK_STATUS.Completed,
        },
        manager,
        IP_ADDRESS,
      );
      expect(tasksRepository.updateStatusWithAudit).toHaveBeenCalledWith(
        1,
        TASK_STATUS.Completed,
        1,
        currentTask,
        IP_ADDRESS,
      );

      expect(result.message).toBe('Cập nhật trạng thái Task thành công.');
      expect(result.data.status).toBe(TASK_STATUS.Completed);
    });

    it('không cho Customer Care cập nhật trạng thái Task không thuộc quyền', async () => {
      tasksRepository.findVisibleById.mockResolvedValue(null);

      await expect(
        tasksService.updateStatus(
          99,
          {
            status: TASK_STATUS.Completed,
          },
          customerCare,
          IP_ADDRESS,
        ),
      ).rejects.toThrow(NotFoundException);

      expect(tasksRepository.findVisibleById).toHaveBeenCalledWith(99, 3);
      expect(tasksRepository.updateStatusWithAudit).not.toHaveBeenCalled();
    });
  });
  describe('cancel', () => {
    it('không cho Customer Care hủy Task không thuộc quyền', async () => {
      tasksRepository.findVisibleById.mockResolvedValue(null);

      await expect(
        tasksService.cancel(99, customerCare, IP_ADDRESS),
      ).rejects.toThrow(NotFoundException);

      expect(tasksRepository.findVisibleById).toHaveBeenCalledWith(99, 3);
      expect(tasksRepository.updateStatusWithAudit).not.toHaveBeenCalled();
    });

    it('không cho hủy lại Task đã Cancelled', async () => {
      tasksRepository.findVisibleById.mockResolvedValue(
        makeTask({ status: TASK_STATUS.Cancelled }),
      );
      await expect(tasksService.cancel(1, manager)).rejects.toThrow(
        ConflictException,
      );
      expect(tasksRepository.updateStatusWithAudit).not.toHaveBeenCalled();
    });
    it('BR18 - hủy Task bằng cách chuyển trạng thái sang Cancelled', async () => {
      const currentTask = makeTask();
      const cancelledTask = makeTask({ status: TASK_STATUS.Cancelled });
      tasksRepository.findVisibleById.mockResolvedValue(currentTask);
      tasksRepository.updateStatusWithAudit.mockResolvedValue(cancelledTask);
      const result = await tasksService.cancel(1, manager, IP_ADDRESS);
      expect(tasksRepository.updateStatusWithAudit).toHaveBeenCalledWith(
        1,
        TASK_STATUS.Cancelled,
        1,
        currentTask,
        IP_ADDRESS,
      );
      expect(result.message).toBe('Xóa Task thành công.');
      expect(result.data.status).toBe(TASK_STATUS.Cancelled);
    });
  });
  describe('assign', () => {
    it('chỉ Sales Manager được phân công Task', async () => {
      await expect(
        tasksService.assign(
          1,
          {
            assignedUserId: 3,
          },
          sales,
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(tasksRepository.findVisibleById).not.toHaveBeenCalled();
      expect(tasksRepository.assignWithAudit).not.toHaveBeenCalled();
    });
    it('BR14 - không phân công cho Sales không tồn tại hoặc bị khóa', async () => {
      tasksRepository.findVisibleById.mockResolvedValue(makeTask());
      tasksRepository.findActiveUserByRole.mockResolvedValue(null);
      await expect(
        tasksService.assign(
          1,
          {
            assignedUserId: 99,
          },
          manager,
        ),
      ).rejects.toThrow(UnprocessableEntityException);
      expect(tasksRepository.assignWithAudit).not.toHaveBeenCalled();
    });
    it('không phân công lại cho đúng nhân viên đang phụ trách', async () => {
      tasksRepository.findVisibleById.mockResolvedValue(makeTask());
      mockActiveSales(2);
      await expect(
        tasksService.assign(
          1,
          {
            assignedUserId: 2,
          },
          manager,
        ),
      ).rejects.toThrow(ConflictException);
      expect(tasksRepository.assignWithAudit).not.toHaveBeenCalled();
    });
    it('BR14, BR18 - Sales Manager phân công Task thành công', async () => {
      const currentTask = makeTask();
      const assignedTask = makeTask({
        assigneduserid: 3,
        users: {
          userid: 3,
          fullname: 'Sales 3',
          email: 'sales3@crm.local',
          status: true,
          roles: {
            rolename: Role.SALES,
          },
        },
      });
      tasksRepository.findVisibleById.mockResolvedValue(currentTask);
      mockActiveSales(3);
      tasksRepository.assignWithAudit.mockResolvedValue(assignedTask);
      const result = await tasksService.assign(
        1,
        {
          assignedUserId: 3,
        },
        manager,
        IP_ADDRESS,
      );
      expect(tasksRepository.assignWithAudit).toHaveBeenCalledWith(
        1,
        3,
        1,
        currentTask,
        IP_ADDRESS,
      );
      expect(result.message).toBe('Phân công Task thành công.');
      expect(result.data.assignedUser?.userId).toBe(3);
    });
  });
});
