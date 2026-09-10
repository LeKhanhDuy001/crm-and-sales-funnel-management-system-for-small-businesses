import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Role } from '../common/enums/role.enum';
import { CreateActivityDto } from './dto/create-activity.dto';
import {
  ActivitiesRepository,
  type ActivityWithRelations,
} from './repositories/activities.repository';
import { UpdateActivityResultDto } from './dto/update-activity-result.dto';

@Injectable()
export class ActivitiesService {
  constructor(private readonly activitiesRepository: ActivitiesRepository) {}

  async findAll(user: AuthenticatedUser) {
    this.ensureSupportedRole(user);

    const activities = await this.activitiesRepository.findManyByUser(
      user.userId,
    );
    return {
      data: activities.map((activity) => this.mapActivity(activity)),
    };
  }

  async getMeta(user: AuthenticatedUser) {
    this.ensureSupportedRole(user);
    const deals =
      user.role === Role.SALES
        ? await this.activitiesRepository.findSalesDealsForActivity(user.userId)
        : await this.activitiesRepository.findCustomerCareDealsForActivity(
            user.userId,
          );

    return {
      deals: deals.map((deal) => ({
        dealId: deal.dealid,
        dealName: deal.dealname,
        customer: {
          customerId: deal.customers.customerid,
          fullName: deal.customers.fullname,
          company: deal.customers.company,
        },
      })),
    };
  }

  async findOne(activityId: number, user: AuthenticatedUser) {
    this.ensureSupportedRole(user);
    const activity = await this.activitiesRepository.findById(activityId);
    if (!activity || activity.userid !== user.userId) {
      throw new NotFoundException(
        'Không tìm thấy Activity hoặc bạn không có quyền truy cập Activity này.',
      );
    }
    return this.mapActivity(activity);
  }

  async create(
    dto: CreateActivityDto,
    user: AuthenticatedUser,
    ipAddress?: string,
  ) {
    this.ensureSupportedRole(user);

    const deal = await this.activitiesRepository.findDealById(dto.dealId);
    if (!deal) {
      throw new NotFoundException('Không tìm thấy Deal.');
    }

    await this.ensureDealAccessible(deal, user);

    const subject = dto.subject.trim();
    const description = dto.description.trim();

    if (!subject) {
      throw new UnprocessableEntityException(
        'Nội dung hoạt động không được để trống.',
      );
    }

    if (!description) {
      throw new UnprocessableEntityException(
        'Mô tả hoạt động không được để trống.',
      );
    }

    // BR-15: Activity phải có Deal, loại hoạt động, thời gian và người thực hiện.
    const activity = await this.activitiesRepository.createWithActivityLog({
      dealId: dto.dealId,
      userId: user.userId,
      activityType: dto.activityType,
      subject,
      description,
      activityTime: new Date(dto.activityTime),
      ipAddress,
    });

    return {
      message: 'Ghi nhận hoạt động chăm sóc thành công.',
      data: this.mapActivity(activity),
    };
  }

  async updateResult(
    activityId: number,
    dto: UpdateActivityResultDto,
    user: AuthenticatedUser,
    ipAddress?: string,
  ) {
    this.ensureSupportedRole(user);
    const current = await this.activitiesRepository.findById(activityId);
    // BR-30: Người dùng chỉ được cập nhật hoặc hủy Activity do chính mình thực hiện.
    if (!current || current.userid !== user.userId) {
      throw new NotFoundException(
        'Không tìm thấy Activity hoặc bạn không có quyền cập nhật Activity này.',
      );
    }

    // BR-31: Activity đã Cancelled không được cập nhật kết quả.
    if (current.status === 'Cancelled') {
      throw new UnprocessableEntityException(
        'Activity đã bị hủy nên không thể cập nhật kết quả.',
      );
    }

    const result = dto.result.trim();

    if (!result) {
      throw new UnprocessableEntityException(
        'Kết quả chăm sóc không được để trống.',
      );
    }

    const activity =
      await this.activitiesRepository.updateResultWithActivityLog(
        activityId,
        result,
        current,
        user.userId,
        ipAddress,
      );

    return {
      message: 'Cập nhật kết quả chăm sóc thành công.',
      data: this.mapActivity(activity),
    };
  }

  private ensureSupportedRole(user: AuthenticatedUser): void {
    if (user.role !== Role.SALES && user.role !== Role.CUSTOMER_CARE) {
      throw new ForbiddenException(
        'Bạn không có quyền sử dụng chức năng Activity.',
      );
    }
  }

  private async ensureDealAccessible(
    deal: Awaited<ReturnType<ActivitiesRepository['findDealById']>>,
    user: AuthenticatedUser,
  ): Promise<void> {
    // BR-30: Sales chỉ được chăm sóc Deal mình phụ trách; Customer Care chỉ được chăm sóc Deal khi có Task đang hoạt động được giao cho chính mình.
    if (!deal) {
      throw new NotFoundException('Không tìm thấy Deal.');
    }

    if (user.role === Role.SALES) {
      if (deal.assigneduserid !== user.userId) {
        throw new NotFoundException(
          'Không tìm thấy Deal hoặc bạn không có quyền chăm sóc Deal này.',
        );
      }
      return;
    }
    if (user.role === Role.CUSTOMER_CARE) {
      const assignedTask =
        await this.activitiesRepository.findActiveAssignedTaskForDeal(
          deal.dealid,
          user.userId,
        );
      if (!assignedTask) {
        throw new NotFoundException(
          'Không tìm thấy Deal hoặc bạn không được phân công chăm sóc Deal này.',
        );
      }
    }
  }

  async cancel(
    activityId: number,
    user: AuthenticatedUser,
    ipAddress?: string,
  ) {
    this.ensureSupportedRole(user);
    const current = await this.activitiesRepository.findById(activityId);
    // BR-30: Người dùng chỉ được cập nhật hoặc hủy Activity do chính mình thực hiện.
    if (!current || current.userid !== user.userId) {
      throw new NotFoundException(
        'Không tìm thấy Activity hoặc bạn không có quyền hủy Activity này.',
      );
    }
    // BR-31: Activity Completed hoặc Cancelled không được phép chuyển sang Cancelled.
    if (current.status === 'Completed') {
      throw new UnprocessableEntityException(
        'Activity đã hoàn thành nên không thể hủy.',
      );
    }

    if (current.status === 'Cancelled') {
      throw new UnprocessableEntityException('Activity này đã được hủy.');
    }
    const activity = await this.activitiesRepository.cancelWithActivityLog(
      activityId,
      current,
      user.userId,
      ipAddress,
    );

    return {
      message: 'Hủy Activity thành công.',
      data: this.mapActivity(activity),
    };
  }

  private mapActivity(activity: ActivityWithRelations) {
    return {
      activityId: activity.activityid,
      activityCode: `AC${String(activity.activityid).padStart(3, '0')}`,
      activityType: activity.activitytype,
      subject: activity.subject,
      description: activity.description,
      activityTime: activity.activitytime,
      result: activity.result,
      status: activity.status,
      user: {
        userId: activity.users.userid,
        fullName: activity.users.fullname,
        email: activity.users.email,
      },
      deal: {
        dealId: activity.deals.dealid,
        dealName: activity.deals.dealname,
      },
      customer: {
        customerId: activity.deals.customers.customerid,
        fullName: activity.deals.customers.fullname,
        company: activity.deals.customers.company,
      },
    };
  }
}
