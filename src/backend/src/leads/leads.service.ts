import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { CreateLeadDto } from './dto/create-lead.dto';
import type { LeadQueryDto } from './dto/lead-query.dto';
import type { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadsRepository } from './repositories/leads.repository';
import type { Prisma } from '../../generated/prisma/client';
import { Role } from '../common/enums/role.enum';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

type LeadWithRelations = Prisma.leadsGetPayload<{
  include: {
    leadsources: true;
    users: {
      select: {
        userid: true;
        fullname: true;
        email: true;
      };
    };
  };
}>;

@Injectable()
export class LeadsService {
  constructor(private readonly leadsRepository: LeadsRepository) {}

  /**
   * Lấy danh sách Lead có tìm kiếm, lọc và phân trang.
   *
   * @param query Điều kiện tìm kiếm và phân trang.
   * @returns Danh sách Lead và thông tin phân trang.
   */
  async findAll(query: LeadQueryDto, currentUser: AuthenticatedUser) {
    const assignedUserId =
      currentUser.role === Role.SALES ? currentUser.userId : undefined;

    const [leads, total] = await Promise.all([
      this.leadsRepository.findMany(query, assignedUserId),
      this.leadsRepository.count(query, assignedUserId),
    ]);

    return {
      data: leads.map((lead) => this.mapLead(lead)),
      page: query.page,
      pageSize: query.limit,
      total,
    };
  }

  /**
   * Lấy chi tiết một Lead.
   *
   * @param leadId Mã Lead.
   * @returns Thông tin Lead.
   */
  async findOne(leadId: number, currentUser: AuthenticatedUser) {
    const lead = await this.leadsRepository.findById(leadId);

    if (!lead) {
      throw new NotFoundException('Lead không tồn tại');
    }

    // Sales chỉ được xem Lead được phân công cho chính mình.
    if (
      currentUser.role === Role.SALES &&
      lead.assigneduserid !== currentUser.userId
    ) {
      throw new NotFoundException('Lead không tồn tại');
    }

    return this.mapLead(lead);
  }

  /**
   * Lấy danh sách nguồn Lead.
   *
   * @returns Các nguồn Lead hiện có.
   */
  async findSources() {
    const sources = await this.leadsRepository.findSources();

    return sources.map((source) => ({
      sourceId: source.sourceid,
      sourceName: source.sourcename,
    }));
  }

  /**
   * Tạo Lead mới.
   *
   * @param dto Dữ liệu Lead.
   * @param currentUserId Người đang thực hiện thao tác.
   * @returns Lead vừa được tạo.
   */
  async create(dto: CreateLeadDto, currentUserId: number) {
    const email = dto.email?.trim().toLowerCase();

    const phone = dto.phone?.trim();

    const duplicate = await this.leadsRepository.findDuplicate(email, phone);

    if (duplicate) {
      if (!dto.mergeDuplicate) {
        if (email && duplicate.email?.toLowerCase() === email) {
          throw new ConflictException('Email của Lead đã tồn tại');
        }

        throw new ConflictException('Số điện thoại của Lead đã tồn tại');
      }

      await this.ensureReferencesExist(dto.sourceId, dto.assignedUserId);

      // BR03: Gộp vào Lead hiện có, bổ sung dữ liệu còn thiếu và giữ nguyên vòng đời Lead.
      const mergedLead = await this.leadsRepository.updateWithLog(
        duplicate.leadid,
        {
          sourceid: duplicate.sourceid ?? dto.sourceId ?? null,
          assigneduserid:
            duplicate.assigneduserid ?? dto.assignedUserId ?? null,
          fullname: duplicate.fullname,
          company: duplicate.company ?? this.normalizeOptional(dto.company),
          phone: duplicate.phone ?? phone ?? null,
          email: duplicate.email ?? email ?? null,
          address: duplicate.address ?? this.normalizeOptional(dto.address),
          status: duplicate.status ?? this.normalizeOptional(dto.status),
        },
        currentUserId,
      );

      return this.mapLead(mergedLead);
    }

    await this.ensureReferencesExist(dto.sourceId, dto.assignedUserId);

    // BR18: Thao tác tạo Lead phải được ghi vào nhật ký hoạt động.
    const lead = await this.leadsRepository.createWithLog(
      {
        sourceid: dto.sourceId ?? null,
        assigneduserid: dto.assignedUserId ?? null,
        fullname: dto.fullName.trim(),
        company: this.normalizeOptional(dto.company),
        phone: phone || null,
        email: email || null,
        address: this.normalizeOptional(dto.address),
        status: this.normalizeOptional(dto.status),
      },
      currentUserId,
    );

    return this.mapLead(lead);
  }

  /**
   * Cập nhật thông tin Lead.
   *
   * @param leadId Mã Lead.
   * @param dto Dữ liệu cần cập nhật.
   * @param currentUserId Người đang thực hiện thao tác.
   * @returns Lead sau khi cập nhật.
   */
  async update(leadId: number, dto: UpdateLeadDto, currentUserId: number) {
    const currentLead = await this.getExistingLead(leadId);

    if (currentLead.status === 'Converted') {
      throw new ConflictException(
        'Lead đã chuyển đổi thành Customer nên không thể chỉnh sửa.',
      );
    }

    const email = dto.email?.trim().toLowerCase();

    const phone = dto.phone?.trim();

    // BR03: Khi thay đổi email hoặc số điện thoại, dữ liệu mới không được trùng Lead khác.
    if (dto.email !== undefined || dto.phone !== undefined) {
      await this.ensureContactIsUnique(email, phone, leadId);
    }

    await this.ensureReferencesExist(dto.sourceId, dto.assignedUserId);

    // BR18: Thao tác cập nhật Lead phải được ghi vào nhật ký hoạt động.
    const lead = await this.leadsRepository.updateWithLog(
      leadId,
      {
        ...(dto.sourceId !== undefined ? { sourceid: dto.sourceId } : {}),
        ...(dto.assignedUserId !== undefined
          ? { assigneduserid: dto.assignedUserId }
          : {}),
        ...(dto.fullName !== undefined
          ? { fullname: dto.fullName.trim() }
          : {}),
        ...(dto.company !== undefined
          ? { company: this.normalizeOptional(dto.company) }
          : {}),
        ...(dto.phone !== undefined ? { phone: phone || null } : {}),
        ...(dto.email !== undefined ? { email: email || null } : {}),
        ...(dto.address !== undefined
          ? { address: this.normalizeOptional(dto.address) }
          : {}),
        ...(dto.status !== undefined
          ? { status: this.normalizeOptional(dto.status) }
          : {}),
      },
      currentUserId,
    );

    return this.mapLead(lead);
  }

  /**
   * Xóa Lead chưa phát sinh liên kết nghiệp vụ.
   *
   * @param leadId Mã Lead.
   * @param currentUserId Người thực hiện thao tác.
   */
  async remove(leadId: number, currentUserId: number): Promise<void> {
    const lead = await this.getExistingLead(leadId);

    // BR20: Lead đã phát sinh Customer không được phép xóa vật lý.
    if (lead.customers) {
      throw new ConflictException(
        'Lead đã phát sinh Customer nên không thể xóa',
      );
    }

    // BR18: Thao tác xóa Lead phải được ghi
    // vào nhật ký hoạt động.
    await this.leadsRepository.deleteWithLog(leadId, currentUserId);
  }

  private async getExistingLead(leadId: number) {
    const lead = await this.leadsRepository.findById(leadId);

    if (!lead) {
      throw new NotFoundException('Lead không tồn tại');
    }

    return lead;
  }

  private async ensureContactIsUnique(
    email?: string,
    phone?: string,
    excludeLeadId?: number,
  ): Promise<void> {
    const duplicate = await this.leadsRepository.findDuplicate(
      email,
      phone,
      excludeLeadId,
    );

    if (!duplicate) {
      return;
    }

    if (email && duplicate.email?.toLowerCase() === email) {
      throw new ConflictException('Email của Lead đã tồn tại');
    }

    throw new ConflictException('Số điện thoại của Lead đã tồn tại');
  }

  private async ensureReferencesExist(
    sourceId?: number,
    assignedUserId?: number,
  ): Promise<void> {
    if (sourceId !== undefined) {
      const source = await this.leadsRepository.findSourceById(sourceId);

      if (!source) {
        throw new BadRequestException('Nguồn Lead không tồn tại');
      }
    }

    if (assignedUserId !== undefined) {
      const user = await this.leadsRepository.findUserById(assignedUserId);

      if (!user) {
        throw new BadRequestException('Người phụ trách không tồn tại');
      }
    }
  }

  private normalizeOptional(value?: string): string | null {
    const normalized = value?.trim();

    return normalized || null;
  }

  private mapLead(lead: LeadWithRelations) {
    return {
      leadId: lead.leadid,
      fullName: lead.fullname,
      company: lead.company,
      phone: lead.phone,
      email: lead.email,
      address: lead.address,
      status: lead.status,
      createdDate: lead.createddate,

      source: lead.leadsources
        ? {
            sourceId: lead.leadsources.sourceid,
            sourceName: lead.leadsources.sourcename,
          }
        : null,

      assignedUser: lead.users
        ? {
            userId: lead.users.userid,
            fullName: lead.users.fullname,
            email: lead.users.email,
          }
        : null,
    };
  }

  /**
   * Chuyển Lead đủ điều kiện thành Customer.
   *
   * @param leadId ID của Lead cần chuyển đổi.
   * @param currentUser Sales đang thực hiện chuyển đổi.
   * @returns Customer vừa được tạo.
   */
  async convertLead(leadId: number, currentUser: AuthenticatedUser) {
    const lead = await this.leadsRepository.findByIdForConversion(leadId);

    if (!lead) {
      throw new NotFoundException('Không tìm thấy Lead.');
    }

    if (lead.assigneduserid !== currentUser.userId) {
      throw new ForbiddenException(
        'Bạn không được phân công phụ trách Lead này.',
      );
    }
    //BR04: Lead chưa được chuyển đổi thành Customer và có đủ điều kiện chuyển đổi
    if (lead.status === 'Converted' || lead.customers) {
      throw new ConflictException('Lead này đã được chuyển thành Customer.');
    }

    // BR04: Chỉ Lead Qualified mới được chuyển.
    if (lead.status !== 'Qualified') {
      throw new UnprocessableEntityException(
        'Lead chưa đủ điều kiện để chuyển thành Customer.',
      );
    }
    // BR04: Lead phải có họ tên hợp lệ
    if (!lead.fullname.trim()) {
      throw new UnprocessableEntityException('Lead chưa có họ tên hợp lệ.');
    }

    const hasPhone = Boolean(lead.phone?.trim());

    const hasEmail = Boolean(lead.email?.trim());

    if (!hasPhone || !hasEmail) {
      throw new UnprocessableEntityException(
        'Lead phải có đầy đủ số điện thoại và email trước khi chuyển đổi.',
      );
    }

    const customer = await this.leadsRepository.convertToCustomer(
      leadId,
      currentUser.userId,
    );

    return {
      message: 'Chuyển Lead thành Customer thành công.',
      customer: {
        customerId: customer.customerid,
        leadId: customer.leadid,
        fullName: customer.fullname,
        company: customer.company,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
      },
    };
  }
}
