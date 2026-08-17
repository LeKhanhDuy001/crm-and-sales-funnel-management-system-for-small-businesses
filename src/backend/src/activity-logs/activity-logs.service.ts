import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ActivityLogQueryDto } from './dto/activity-log-query.dto';
import {
  type ActivityLogFilter,
  ActivityLogsRepository,
} from './repositories/activity-logs.repository';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function createDateStart(value: string): Date {
  return new Date(`${value}T00:00:00.000+07:00`);
}

function createNextDate(value: string): Date {
  const start = createDateStart(value);

  return new Date(start.getTime() + ONE_DAY_MS);
}

@Injectable()
export class ActivityLogsService {
  constructor(
    private readonly activityLogsRepository: ActivityLogsRepository,
  ) {}

  /**
   * Lấy danh sách nhật ký hoạt động dành cho Admin.
   */
  async findAll(query: ActivityLogQueryDto) {
    this.validateDateRange(query);

    const { page = 1, limit = 20 } = query;

    const filter = this.createFilter(query);

    const [logs, total] = await Promise.all([
      this.activityLogsRepository.findMany({
        ...filter,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.activityLogsRepository.count(filter),
    ]);

    return {
      data: logs.map((log) => ({
        logId: log.logid,
        user: log.users
          ? {
              userId: log.users.userid,
              fullName: log.users.fullname,
              email: log.users.email,
            }
          : null,
        action: log.action,
        tableName: log.tablename,
        recordId: log.recordid,
        actionTime: log.actiontime,
        ipAddress: log.ipaddress,
        oldValue: log.oldvalue,
        newValue: log.newvalue,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy danh sách người dùng cho bộ lọc Activity Log.
   */
  async findFilterUsers() {
    const users = await this.activityLogsRepository.findUsers();

    return {
      data: users.map((user) => ({
        userId: user.userid,
        fullName: user.fullname,
        email: user.email,
      })),
    };
  }

  private createFilter(query: ActivityLogQueryDto): ActivityLogFilter {
    return {
      userId: query.userId,
      action: query.action,
      fromDate: query.fromDate ? createDateStart(query.fromDate) : undefined,
      toDateExclusive: query.toDate ? createNextDate(query.toDate) : undefined,
    };
  }

  private validateDateRange(query: ActivityLogQueryDto): void {
    if (!query.fromDate || !query.toDate) {
      return;
    }

    if (query.fromDate > query.toDate) {
      throw new UnprocessableEntityException(
        'Ngày bắt đầu không được sau ngày kết thúc.',
      );
    }
  }
}
