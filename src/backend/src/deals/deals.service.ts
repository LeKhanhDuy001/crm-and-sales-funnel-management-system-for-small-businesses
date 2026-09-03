import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Role } from '../common/enums/role.enum';
import { getDealStatusByStage } from './constants/deal-status.constant';
import { CreateDealDto } from './dto/create-deal.dto';
import { DealQueryDto } from './dto/deal-query.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import {
  type CreateDealData,
  type DealWithRelations,
  DealsRepository,
  type UpdateDealData,
} from './repositories/deals.repository';
import { UpdateDealStageDto } from './dto/update-deal-stage.dto';
import { AssignDealDto } from './dto/assign-deal.dto';

@Injectable()
export class DealsService {
  constructor(private readonly dealsRepository: DealsRepository) {}

  /**
   * Lấy danh sách Deal thuộc quyền quản lý của Sales hiện tại.
   */
  async findAll(query: DealQueryDto, user: AuthenticatedUser) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const filter = {
      search: query.search,
      stageId: query.stageId,
      salesUserId: user.role === Role.SALES ? user.userId : undefined,
    };

    const [deals, total] = await Promise.all([
      this.dealsRepository.findMany(filter, skip, limit),
      this.dealsRepository.count(filter),
    ]);

    return {
      data: deals.map((deal) => this.mapDeal(deal)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy danh sách giai đoạn Pipeline dùng cho form và bộ lọc Deal.
   */
  async getMeta(user: AuthenticatedUser) {
    const [stages, salesUsers] = await Promise.all([
      this.dealsRepository.findPipelineStages(),
      user.role === Role.SALES_MANAGER
        ? this.dealsRepository.findActiveUsersByRole(Role.SALES)
        : Promise.resolve([]),
    ]);

    return {
      stages: stages.map((stage) => ({
        stageId: stage.stageid,
        stageName: stage.stagename,
        stageOrder: stage.stageorder,
        probability: stage.probability,
      })),
      salesUsers: salesUsers.map((salesUser) => ({
        userId: salesUser.userid,
        fullName: salesUser.fullname,
        email: salesUser.email,
      })),
    };
  }

  /**
   * Lấy chi tiết một Deal thuộc quyền của Sales hiện tại.
   */
  async findOne(dealId: number, user: AuthenticatedUser) {
    const deal = await this.findVisibleDeal(dealId, user);
    return this.mapDeal(deal);
  }

  /**
   * Tạo Deal mới và tự động gán Sales đang đăng nhập làm người phụ trách.
   */
  async create(
    dto: CreateDealDto,
    user: AuthenticatedUser,
    ipAddress: string | null,
  ) {
    // BR-06: Deal phải có Customer, người phụ trách và Pipeline.
    await this.ensureCustomerAccessible(dto.customerId, user);
    // BR-29: Xác định người phụ trách Deal theo vai trò người tạo.
    const assignedUserId = await this.resolveCreateAssignee(
      dto.assignedUserId,
      user,
    );
    const stage = await this.requireInitialStage();
    if (dto.stageId !== stage.stageid) {
      throw new UnprocessableEntityException(
        'Deal mới phải bắt đầu ở giai đoạn đầu tiên của Pipeline.',
      );
    }

    // BR-08: Xác suất phải tương ứng với giai đoạn Pipeline.
    const probability = this.requireStageProbability(
      stage.probability,
      stage.stagename,
    );
    const status = getDealStatusByStage(stage.stagename);

    // BR-09: Expected Revenue = Deal Value × Probability.
    const expectedRevenue = this.calculateExpectedRevenue(
      dto.dealValue,
      probability,
    );

    const data = this.buildCreateData(
      dto,
      assignedUserId,
      probability,
      expectedRevenue,
      status,
    );

    // BR-14: Manager giao Deal cho Sales phải gửi Notification.
    // BR-18: thao tác tạo Deal phải được ghi Activity Log.
    const deal = await this.dealsRepository.createWithLog(
      data,
      user.userId,
      ipAddress,
      user.role === Role.SALES_MANAGER,
    );
    return {
      message: 'Tạo Deal thành công.',
      data: this.mapDeal(deal),
    };
  }

  /**
   * Cập nhật thông tin Deal thuộc quyền quản lý của Sales hiện tại.
   */
  async update(
    dealId: number,
    dto: UpdateDealDto,
    user: AuthenticatedUser,
    ipAddress: string | null,
  ) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Không có dữ liệu để cập nhật.');
    }

    const currentDeal = await this.findVisibleDeal(dealId, user);

    if (dto.customerId !== undefined) {
      await this.ensureCustomerAccessible(dto.customerId, user);
    }

    const data = this.buildUpdateData(
      dto,
      Number(currentDeal.dealvalue),
      currentDeal.probability ?? 0,
    );

    // BR-18: thao tác cập nhật Deal phải được ghi Activity Log.
    const deal = await this.dealsRepository.updateWithLog(
      dealId,
      data,
      user.userId,
      ipAddress,
    );

    return {
      message: 'Cập nhật Deal thành công.',
      data: this.mapDeal(deal),
    };
  }

  /**
   * Xóa Deal chưa phát sinh dữ liệu nghiệp vụ liên quan.
   */
  async remove(
    dealId: number,
    user: AuthenticatedUser,
    ipAddress: string | null,
  ): Promise<void> {
    await this.findVisibleDeal(dealId, user);
    const linked = await this.dealsRepository.getLinkedRecordCount(dealId);
    if (!linked) {
      throw new NotFoundException('Không tìm thấy Deal.');
    }

    const hasLinkedData =
      linked._count.quotes > 0 ||
      linked._count.activities > 0 ||
      linked._count.tasks > 0;

    // BR-20: dữ liệu đã phát sinh liên kết không được xóa vật lý.
    if (hasLinkedData) {
      throw new UnprocessableEntityException(
        'Deal đã phát sinh dữ liệu liên quan nên không thể xóa.',
      );
    }

    // BR-18: thao tác xóa Deal phải được ghi Activity Log.
    await this.dealsRepository.deleteWithLog(dealId, user.userId, ipAddress);
  }

  private async findVisibleDeal(
    dealId: number,
    user: AuthenticatedUser,
  ): Promise<DealWithRelations> {
    const deal =
      user.role === Role.SALES
        ? await this.dealsRepository.findOwnedById(dealId, user.userId)
        : await this.dealsRepository.findById(dealId);
    if (!deal) {
      throw new NotFoundException('Không tìm thấy Deal.');
    }

    return deal;
  }

  private async findOwnedDeal(dealId: number, salesUserId: number) {
    const deal = await this.dealsRepository.findOwnedById(dealId, salesUserId);

    if (!deal) {
      throw new NotFoundException('Không tìm thấy Deal.');
    }
    return deal;
  }

  private async ensureCustomerAccessible(
    customerId: number,
    user: AuthenticatedUser,
  ): Promise<void> {
    const customer =
      user.role === Role.SALES
        ? await this.dealsRepository.findCustomerAccessible(
            customerId,
            user.userId,
          )
        : await this.dealsRepository.findCustomerById(customerId);

    if (customer) {
      return;
    }

    if (user.role === Role.SALES) {
      throw new UnprocessableEntityException(
        'Customer không tồn tại hoặc không thuộc quyền quản lý của Sales.',
      );
    }
    throw new UnprocessableEntityException('Customer không tồn tại.');
  }

  private async requireStage(stageId: number) {
    const stage = await this.dealsRepository.findStageById(stageId);

    if (!stage) {
      throw new UnprocessableEntityException(
        'Giai đoạn Pipeline không tồn tại.',
      );
    }

    return stage;
  }

  private async requireInitialStage() {
    const stage = await this.dealsRepository.findInitialStage();
    if (!stage) {
      throw new UnprocessableEntityException(
        'Pipeline chưa được cấu hình giai đoạn khởi đầu.',
      );
    }

    return stage;
  }

  private requireStageProbability(
    probability: number,
    stageName: string,
  ): number {
    if (probability < 0 || probability > 100) {
      throw new UnprocessableEntityException(
        `Giai đoạn "${stageName}" có xác suất không hợp lệ.`,
      );
    }

    return probability;
  }

  private calculateExpectedRevenue(
    dealValue: number,
    probability: number,
  ): Prisma.Decimal {
    return new Prisma.Decimal(dealValue).mul(probability).div(100);
  }

  private buildCreateData(
    dto: CreateDealDto,
    assignedUserId: number,
    probability: number,
    expectedRevenue: Prisma.Decimal,
    status: string,
  ): CreateDealData {
    return {
      customerid: dto.customerId,
      assigneduserid: assignedUserId,
      stageid: dto.stageId,
      dealname: dto.dealName.trim(),
      dealvalue: new Prisma.Decimal(dto.dealValue),
      probability,
      expectedrevenue: expectedRevenue,
      expectedclosedate: this.toDate(dto.expectedCloseDate),
      status,
    };
  }

  private buildUpdateData(
    dto: UpdateDealDto,
    currentDealValue: number,
    probability: number,
  ): UpdateDealData {
    const data: UpdateDealData = {};

    if (dto.customerId !== undefined) {
      data.customerid = dto.customerId;
    }

    if (dto.dealName !== undefined) {
      data.dealname = dto.dealName.trim();
    }

    if (dto.dealValue !== undefined) {
      data.dealvalue = new Prisma.Decimal(dto.dealValue);

      data.expectedrevenue = this.calculateExpectedRevenue(
        dto.dealValue,
        probability,
      );
    } else {
      data.expectedrevenue = this.calculateExpectedRevenue(
        currentDealValue,
        probability,
      );
    }

    if (dto.expectedCloseDate !== undefined) {
      data.expectedclosedate = this.toDate(dto.expectedCloseDate);
    }

    return data;
  }

  private toDate(value?: string): Date | null {
    if (!value) {
      return null;
    }
    return new Date(value);
  }

  private mapDeal(deal: DealWithRelations) {
    return {
      dealId: deal.dealid,
      dealCode: `DL${String(deal.dealid).padStart(3, '0')}`,
      dealName: deal.dealname,
      dealValue: Number(deal.dealvalue),
      probability: deal.probability,
      expectedRevenue:
        deal.expectedrevenue === null ? null : Number(deal.expectedrevenue),
      expectedCloseDate: deal.expectedclosedate,
      status: deal.status,
      createdDate: deal.createddate,

      customer: {
        customerId: deal.customers.customerid,
        fullName: deal.customers.fullname,
        company: deal.customers.company,
      },

      stage: {
        stageId: deal.pipelinestages.stageid,
        stageName: deal.pipelinestages.stagename,
        stageOrder: deal.pipelinestages.stageorder,
      },

      assignedUser: {
        userId: deal.users.userid,
        fullName: deal.users.fullname,
      },
    };
  }

  private async resolveCreateAssignee(
    requestedUserId: number | undefined,
    user: AuthenticatedUser,
  ): Promise<number> {
    // BR-29: Sales tạo Deal thì hệ thống tự gán chính Sales đó.
    if (user.role === Role.SALES) {
      return user.userId;
    }

    // BR-06, BR-29: Deal do Sales Manager tạo vẫn bắt buộc có Sales phụ trách.
    if (requestedUserId === undefined) {
      throw new UnprocessableEntityException(
        'Vui lòng chọn nhân viên Sales phụ trách Deal.',
      );
    }

    const assignee = await this.dealsRepository.findUserById(requestedUserId);

    if (!assignee) {
      throw new UnprocessableEntityException('Nhân viên Sales không tồn tại.');
    }

    // BR-07, BR-29: người được giao Deal phải là Sales.
    if (String(assignee.roles.rolename) !== String(Role.SALES)) {
      throw new UnprocessableEntityException(
        'Người được phân công phải có vai trò Sales.',
      );
    }

    if (assignee.status !== true) {
      throw new UnprocessableEntityException(
        'Không thể phân công Deal cho tài khoản Sales đã bị khóa.',
      );
    }

    return assignee.userid;
  }

  /**
   * Phân công lại Deal cho một nhân viên Sales.
   */
  async assign(
    dealId: number,
    dto: AssignDealDto,
    user: AuthenticatedUser,
    ipAddress?: string,
  ) {
    // BR-07: Chỉ Sales Manager hoặc Admin được phân công/thay đổi người phụ trách Deal.
    if (user.role !== Role.SALES_MANAGER && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền phân công Deal.');
    }

    const currentDeal = await this.dealsRepository.findById(dealId);

    if (!currentDeal) {
      throw new NotFoundException('Không tìm thấy Deal.');
    }

    const assignee = await this.dealsRepository.findUserById(
      dto.assignedUserId,
    );

    if (!assignee) {
      throw new UnprocessableEntityException('Nhân viên Sales không tồn tại.');
    }

    if (String(assignee.roles.rolename) !== String(Role.SALES)) {
      throw new UnprocessableEntityException(
        'Người được phân công phải có vai trò Sales.',
      );
    }

    if (assignee.status !== true) {
      throw new UnprocessableEntityException(
        'Không thể phân công Deal cho tài khoản Sales đã bị khóa.',
      );
    }

    if (currentDeal.assigneduserid === dto.assignedUserId) {
      throw new ConflictException('Deal đã được phân công cho nhân viên này.');
    }

    // BR-14, BR-18: phân công Deal phải gửi Notification và ghi Activity Log.
    const deal = await this.dealsRepository.assignWithLog(
      dealId,
      dto.assignedUserId,
      user.userId,
      currentDeal,
      ipAddress,
    );

    return {
      message: 'Phân công Deal thành công.',
      data: this.mapDeal(deal),
    };
  }

  /**
   * Thay đổi Pipeline Stage của Deal thuộc Sales đang đăng nhập.
   */
  async changeStage(
    dealId: number,
    dto: UpdateDealStageDto,
    user: AuthenticatedUser,
    ipAddress?: string,
  ) {
    const currentDeal = await this.findVisibleDeal(dealId, user);

    if (currentDeal.stageid === dto.stageId) {
      return {
        message: 'Deal đang ở giai đoạn này.',
        data: this.mapDeal(currentDeal),
      };
    }
    // BR-10: Deal đang ở Won hoặc Lost thì không chuyển về trạng thái trước
    if (this.isTerminalStage(currentDeal.pipelinestages.stagename)) {
      throw new UnprocessableEntityException(
        'Deal đang ở giai đoạn Won hoặc Lost nên không thể thay đổi giai đoạn.',
      );
    }

    const targetStage = await this.dealsRepository.findStageById(dto.stageId);

    if (!targetStage) {
      throw new UnprocessableEntityException(
        'Giai đoạn Pipeline không hợp lệ.',
      );
    }

    // BR-08: cập nhật lại xác suất
    const probability = this.requireStageProbability(
      targetStage.probability,
      targetStage.stagename,
    );
    const status = getDealStatusByStage(targetStage.stagename);

    // BR-09: tính doanh thu kỳ vọng
    const expectedRevenue = this.calculateExpectedRevenue(
      Number(currentDeal.dealvalue),
      probability,
    );

    // BR-18: ghi vào nhật ký
    const updatedDeal = await this.dealsRepository.changeStageWithLog({
      dealId,
      stageId: targetStage.stageid,
      stageName: targetStage.stagename,
      probability,
      expectedRevenue,
      status,
      currentDeal,
      userId: user.userId,
      ipAddress,
    });

    return {
      message: 'Cập nhật giai đoạn Deal thành công.',
      data: this.mapDeal(updatedDeal),
    };
  }

  private isTerminalStage(stageName: string): boolean {
    const normalizedStage = stageName.trim().toLowerCase();

    return normalizedStage === 'won' || normalizedStage === 'lost';
  }
}
