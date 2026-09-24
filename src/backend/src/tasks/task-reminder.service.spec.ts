import { TaskReminderService } from './task-reminder.service';
import { TaskReminderRepository } from './repositories/task-reminder.repository';

describe('TaskReminderService', () => {
  let service: TaskReminderService;

  let reminderRepository: {
    findDueReminders: jest.Mock;
    createReminder: jest.Mock;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-14T10:00:00.000Z'));

    reminderRepository = {
      findDueReminders: jest.fn(),
      createReminder: jest.fn(),
    };

    service = new TaskReminderService(
      reminderRepository as unknown as TaskReminderRepository,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should not create reminder when there are no due tasks', async () => {
    reminderRepository.findDueReminders.mockResolvedValue([]);

    await service.processReminders();

    expect(reminderRepository.findDueReminders).toHaveBeenCalledWith(
      new Date('2026-09-14T10:00:00.000Z'),
    );

    expect(reminderRepository.createReminder).not.toHaveBeenCalled();
  });

  it('should create reminder for a due task', async () => {
    const dueDate = new Date('2026-09-20T02:30:00.000Z');

    reminderRepository.findDueReminders.mockResolvedValue([
      {
        taskId: 1,
        assignedUserId: 5,
        title: 'Gọi khách hàng',
        dueDate,
      },
    ]);

    reminderRepository.createReminder.mockResolvedValue(true);

    await service.processReminders();

    const expectedDeadline = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dueDate);

    expect(reminderRepository.createReminder).toHaveBeenCalledWith(
      1,
      5,
      'Nhắc việc TK001',
      `Gọi khách hàng sẽ đến hạn lúc ${expectedDeadline}.`,
      new Date('2026-09-14T10:00:00.000Z'),
    );
  });

  it('should use fallback values when title and due date are null', async () => {
    reminderRepository.findDueReminders.mockResolvedValue([
      {
        taskId: 12,
        assignedUserId: 3,
        title: null,
        dueDate: null,
      },
    ]);

    reminderRepository.createReminder.mockResolvedValue(true);

    await service.processReminders();

    expect(reminderRepository.createReminder).toHaveBeenCalledWith(
      12,
      3,
      'Nhắc việc TK012',
      'Công việc sẽ đến hạn lúc không xác định.',
      new Date('2026-09-14T10:00:00.000Z'),
    );
  });

  it('should create reminders for all due tasks', async () => {
    reminderRepository.findDueReminders.mockResolvedValue([
      {
        taskId: 2,
        assignedUserId: 4,
        title: 'Task 1',
        dueDate: null,
      },
      {
        taskId: 15,
        assignedUserId: 7,
        title: 'Task 2',
        dueDate: null,
      },
    ]);

    reminderRepository.createReminder.mockResolvedValue(true);

    await service.processReminders();

    expect(reminderRepository.createReminder).toHaveBeenCalledTimes(2);

    expect(reminderRepository.createReminder).toHaveBeenNthCalledWith(
      1,
      2,
      4,
      'Nhắc việc TK002',
      'Task 1 sẽ đến hạn lúc không xác định.',
      new Date('2026-09-14T10:00:00.000Z'),
    );

    expect(reminderRepository.createReminder).toHaveBeenNthCalledWith(
      2,
      15,
      7,
      'Nhắc việc TK015',
      'Task 2 sẽ đến hạn lúc không xác định.',
      new Date('2026-09-14T10:00:00.000Z'),
    );
  });
});
