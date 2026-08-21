import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Role } from '../common/enums/role.enum';
import { LeadAssignmentQueryDto } from './dto/lead-assignment-query.dto';
import { LeadAssignmentsRepository } from './repositories/lead-assignments.repository';

@Injectable()
export class LeadAssignmentsService {
  constructor(private readonly repository: LeadAssignmentsRepository) {}

  /**
   * Lấy danh sách Lead phục vụ màn hình phân công.
   *
   * @param query Điều kiện tìm kiếm và phân trang.
   * @returns Danh sách Lead và thông tin phân trang.
   */
  async findAll(query: LeadAssignmentQueryDto) {
    const result = await this.repository.findMany({
      search: query.search,
      page: query.page,
      limit: query.limit,
    });

    return {
      data: result.data.map((lead) => ({
        leadId: lead.leadid,
        leadCode: `LD${String(lead.leadid).padStart(3, '0')}`,
        fullName: lead.fullname,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        sourceName: lead.leadsources?.sourcename ?? null,

        assignedUser: lead.users
          ? {
              userId: lead.users.userid,
              fullName: lead.users.fullname,
              email: lead.users.email,
            }
          : null,
      })),

      pagination: {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / query.limit),
      },
    };
  }

  /**
   * Lấy danh sách Sales có thể nhận Lead.
   *
   * @returns Danh sách tài khoản Sales đang hoạt động.
   */
  async getAssignmentMeta() {
    // BR26: Lead chỉ được phân công cho tài khoản có vai trò Sales và đang hoạt động.
    const sales = await this.repository.findActiveSales();
    return {
      assignees: sales.map((user) => ({
        userId: user.userid,
        fullName: user.fullname,
        email: user.email,
      })),
    };
  }

  /**
   * Phân công một Lead cho nhân viên Sales.
   *
   * @param leadId Mã Lead cần phân công.
   * @param assignedUserId Mã Sales được giao.
   * @param currentUser Người thực hiện phân công.
   */
  async assign(
    leadId: number,
    assignedUserId: number,
    currentUser: AuthenticatedUser,
  ) {
    // BR25: Chỉ Sales Manager được phép phân công hoặc thay đổi nhân viên Sales phụ trách Lead.
    if (currentUser.role !== Role.SALES_MANAGER) {
      throw new ForbiddenException('Bạn không có quyền phân công Lead.');
    }

    const lead = await this.repository.findLeadById(leadId);

    if (!lead) {
      throw new NotFoundException('Lead không tồn tại.');
    }

    // BR28: Lead đã chuyển đổi thành Customer không được phép phân công lại.
    if (lead.status === 'Converted') {
      throw new UnprocessableEntityException(
        'Lead đã chuyển đổi thành Customer nên không thể phân công.',
      );
    }

    // BR26: Lead chỉ được phân công cho tài khoản có vai trò Sales và đang hoạt động.
    const sales = await this.repository.findActiveSalesById(assignedUserId);
    if (!sales) {
      throw new UnprocessableEntityException(
        'Chỉ được phân công Lead cho nhân viên Sales đang hoạt động.',
      );
    }

    if (lead.assigneduserid === assignedUserId) {
      return {
        message: 'Lead đã được phân công cho Sales này.',
      };
    }

    // BR14: Khi Lead được phân công, hệ thống tạo Notification cho nhân viên được giao.
    // BR18: Thao tác phân công phải được ghi nhận vào Activity Log.
    await this.repository.assignLead({
      leadId,
      assignedUserId,
      actorUserId: currentUser.userId,
      leadName: lead.fullname,
    });

    return {
      message: 'Phân công Lead thành công.',
    };
  }
}
