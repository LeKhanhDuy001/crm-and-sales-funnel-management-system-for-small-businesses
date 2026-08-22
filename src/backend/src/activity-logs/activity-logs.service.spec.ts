import { UnprocessableEntityException } from '@nestjs/common';
import { action_type } from '../../generated/prisma/client';
import type { ActivityLogQueryDto } from './dto/activity-log-query.dto';
import { ActivityLogsRepository } from './repositories/activity-logs.repository';
import { ActivityLogsService } from './activity-logs.service';

type ActivityLogsRepositoryMock = {
  findMany: jest.Mock;
  count: jest.Mock;
  findUsers: jest.Mock;
};

describe('ActivityLogsService - Admin xem Activity Log', () => {
  let activityLogsService: ActivityLogsService;
  let activityLogsRepository: ActivityLogsRepositoryMock;

  const log = {
    logid: 10,
    userid: 2,
    action: action_type.Update,
    tablename: 'users',
    recordid: 2,
    actiontime: new Date('2026-08-20T08:30:00.000Z'),
    ipaddress: '127.0.0.1',
    oldvalue: { fullName: 'Nguyễn Văn A' },
    newvalue: { fullName: 'Nguyễn Văn B' },
    users: {
      userid: 2,
      fullname: 'Nguyễn Văn B',
      email: 'sales@crm.com',
    },
  };

  beforeEach(() => {
    activityLogsRepository = {
      findMany: jest.fn(),
      count: jest.fn(),
      findUsers: jest.fn(),
    };
    activityLogsService = new ActivityLogsService(
      activityLogsRepository as unknown as ActivityLogsRepository,
    );
  });

  describe('findAll', () => {
    it('lấy danh sách Activity Log với phân trang mặc định', async () => {
      activityLogsRepository.findMany.mockResolvedValue([log]);
      activityLogsRepository.count.mockResolvedValue(1);
      const result = await activityLogsService.findAll(
        {} as ActivityLogQueryDto,
      );
      expect(activityLogsRepository.findMany).toHaveBeenCalledWith({
        userId: undefined,
        action: undefined,
        fromDate: undefined,
        toDateExclusive: undefined,
        skip: 0,
        take: 20,
      });
      expect(activityLogsRepository.count).toHaveBeenCalledWith({
        userId: undefined,
        action: undefined,
        fromDate: undefined,
        toDateExclusive: undefined,
      });
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
    });
    it('lọc Activity Log theo User và Action', async () => {
      activityLogsRepository.findMany.mockResolvedValue([log]);
      activityLogsRepository.count.mockResolvedValue(1);
      const query = {
        userId: 2,
        action: action_type.Update,
        page: 1,
        limit: 10,
      } as ActivityLogQueryDto;
      await activityLogsService.findAll(query);
      expect(activityLogsRepository.findMany).toHaveBeenCalledWith({
        userId: 2,
        action: action_type.Update,
        fromDate: undefined,
        toDateExclusive: undefined,
        skip: 0,
        take: 10,
      });
      expect(activityLogsRepository.count).toHaveBeenCalledWith({
        userId: 2,
        action: action_type.Update,
        fromDate: undefined,
        toDateExclusive: undefined,
      });
    });
    it('lọc Activity Log theo khoảng thời gian và chuyển ngày kết thúc thành mốc exclusive', async () => {
      activityLogsRepository.findMany.mockResolvedValue([log]);
      activityLogsRepository.count.mockResolvedValue(1);
      const query = {
        fromDate: '2026-08-01',
        toDate: '2026-08-17',
        page: 1,
        limit: 20,
      } as ActivityLogQueryDto;
      await activityLogsService.findAll(query);
      expect(activityLogsRepository.findMany).toHaveBeenCalledWith({
        userId: undefined,
        action: undefined,
        fromDate: new Date('2026-08-01T00:00:00.000+07:00'),
        toDateExclusive: new Date('2026-08-18T00:00:00.000+07:00'),
        skip: 0,
        take: 20,
      });
      expect(activityLogsRepository.count).toHaveBeenCalledWith({
        userId: undefined,
        action: undefined,
        fromDate: new Date('2026-08-01T00:00:00.000+07:00'),
        toDateExclusive: new Date('2026-08-18T00:00:00.000+07:00'),
      });
    });
    it('lọc Activity Log chỉ với ngày bắt đầu', async () => {
      activityLogsRepository.findMany.mockResolvedValue([]);
      activityLogsRepository.count.mockResolvedValue(0);
      const query = { fromDate: '2026-08-10' } as ActivityLogQueryDto;
      await activityLogsService.findAll(query);
      expect(activityLogsRepository.findMany).toHaveBeenCalledWith({
        userId: undefined,
        action: undefined,
        fromDate: new Date('2026-08-10T00:00:00.000+07:00'),
        toDateExclusive: undefined,
        skip: 0,
        take: 20,
      });
    });
    it('lọc Activity Log chỉ với ngày kết thúc', async () => {
      activityLogsRepository.findMany.mockResolvedValue([]);
      activityLogsRepository.count.mockResolvedValue(0);
      const query = { toDate: '2026-08-17' } as ActivityLogQueryDto;
      await activityLogsService.findAll(query);
      expect(activityLogsRepository.findMany).toHaveBeenCalledWith({
        userId: undefined,
        action: undefined,
        fromDate: undefined,
        toDateExclusive: new Date('2026-08-18T00:00:00.000+07:00'),
        skip: 0,
        take: 20,
      });
    });
    it('từ chối khi ngày bắt đầu sau ngày kết thúc', async () => {
      const query = {
        fromDate: '2026-08-20',
        toDate: '2026-08-10',
      } as ActivityLogQueryDto;
      await expect(activityLogsService.findAll(query)).rejects.toThrow(
        new UnprocessableEntityException(
          'Ngày bắt đầu không được sau ngày kết thúc.',
        ),
      );
      expect(activityLogsRepository.findMany).not.toHaveBeenCalled();
      expect(activityLogsRepository.count).not.toHaveBeenCalled();
    });
    it('cho phép ngày bắt đầu và ngày kết thúc giống nhau', async () => {
      activityLogsRepository.findMany.mockResolvedValue([]);
      activityLogsRepository.count.mockResolvedValue(0);
      const query = {
        fromDate: '2026-08-17',
        toDate: '2026-08-17',
      } as ActivityLogQueryDto;
      await expect(activityLogsService.findAll(query)).resolves.toBeDefined();
      expect(activityLogsRepository.findMany).toHaveBeenCalledWith({
        userId: undefined,
        action: undefined,
        fromDate: new Date('2026-08-17T00:00:00.000+07:00'),
        toDateExclusive: new Date('2026-08-18T00:00:00.000+07:00'),
        skip: 0,
        take: 20,
      });
    });
    it('map đúng dữ liệu Activity Log và thông tin User', async () => {
      activityLogsRepository.findMany.mockResolvedValue([log]);
      activityLogsRepository.count.mockResolvedValue(1);
      const result = await activityLogsService.findAll(
        {} as ActivityLogQueryDto,
      );
      expect(result.data[0]).toEqual({
        logId: 10,
        user: {
          userId: 2,
          fullName: 'Nguyễn Văn B',
          email: 'sales@crm.com',
        },
        action: action_type.Update,
        tableName: 'users',
        recordId: 2,
        actionTime: new Date('2026-08-20T08:30:00.000Z'),
        ipAddress: '127.0.0.1',
        oldValue: { fullName: 'Nguyễn Văn A' },
        newValue: { fullName: 'Nguyễn Văn B' },
      });
    });
    it('trả user bằng null khi Activity Log không gắn với User', async () => {
      const systemLog = {
        ...log,
        userid: null,
        users: null,
      };
      activityLogsRepository.findMany.mockResolvedValue([systemLog]);
      activityLogsRepository.count.mockResolvedValue(1);
      const result = await activityLogsService.findAll(
        {} as ActivityLogQueryDto,
      );
      expect(result.data[0]?.user).toBeNull();
    });
    it('trả danh sách rỗng khi không có Activity Log phù hợp', async () => {
      activityLogsRepository.findMany.mockResolvedValue([]);
      activityLogsRepository.count.mockResolvedValue(0);

      const result = await activityLogsService.findAll({
        userId: 999,
        page: 1,
        limit: 20,
      });
      expect(result.data).toEqual([]);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      });
    });
    it('tính đúng skip và tổng số trang khi phân trang', async () => {
      activityLogsRepository.findMany.mockResolvedValue([]);
      activityLogsRepository.count.mockResolvedValue(45);
      const result = await activityLogsService.findAll({
        page: 3,
        limit: 20,
      });
      expect(activityLogsRepository.findMany).toHaveBeenCalledWith({
        userId: undefined,
        action: undefined,
        fromDate: undefined,
        toDateExclusive: undefined,
        skip: 40,
        take: 20,
      });
      expect(result.pagination).toEqual({
        page: 3,
        limit: 20,
        total: 45,
        totalPages: 3,
      });
    });
  });
  describe('findFilterUsers', () => {
    it('trả danh sách User dùng cho bộ lọc Activity Log', async () => {
      activityLogsRepository.findUsers.mockResolvedValue([
        {
          userid: 1,
          fullname: 'Admin Demo',
          email: 'admin@crm.com',
        },
        {
          userid: 2,
          fullname: 'Nguyễn Văn Sales',
          email: 'sales@crm.com',
        },
      ]);
      const result = await activityLogsService.findFilterUsers();
      expect(activityLogsRepository.findUsers).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: [
          {
            userId: 1,
            fullName: 'Admin Demo',
            email: 'admin@crm.com',
          },
          {
            userId: 2,
            fullName: 'Nguyễn Văn Sales',
            email: 'sales@crm.com',
          },
        ],
      });
    });
  });
});
