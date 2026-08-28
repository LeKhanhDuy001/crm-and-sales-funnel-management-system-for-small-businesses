import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Role } from '../common/enums/role.enum';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomersRepository } from './repositories/customers.repository';

@Injectable()
export class CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) {}

  /**
   * Lấy danh sách Customer theo quyền của người dùng.
   *
   * Sales chỉ xem Customer liên quan đến Lead/Deal của mình.
   * Customer Care xem toàn bộ Customer.
   */
  async findAll(query: CustomerQueryDto, user: AuthenticatedUser) {
    const { page = 1, limit = 20 } = query;

    const salesUserId = this.getSalesScopeUserId(user);

    const filter = {
      search: query.search || undefined,
      customerType: query.customerType || undefined,
      salesUserId,
    };

    const [customers, total] = await Promise.all([
      this.customersRepository.findMany({
        ...filter,
        skip: (page - 1) * limit,
        take: limit,
      }),

      this.customersRepository.count(filter),
    ]);

    return {
      data: customers.map((customer) => this.mapCustomer(customer)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy chi tiết Customer theo quyền record-level.
   */
  async findOne(customerId: number, user: AuthenticatedUser) {
    const customer = await this.findAccessibleCustomer(customerId, user);
    return this.mapCustomer(customer);
  }

  /**
   * Cập nhật Customer và ghi Activity Log.
   */
  async update(
    customerId: number,
    dto: UpdateCustomerDto,
    user: AuthenticatedUser,
    ipAddress?: string,
  ) {
    const hasUpdateData = [dto.fullName, dto.company, dto.phone, dto.email, dto.address, dto.customerType].some((value) => value !== undefined);
    if (!hasUpdateData) {
      throw new BadRequestException('Không có dữ liệu Customer cần cập nhật.');
    }

    const current = await this.findAccessibleCustomer(customerId, user);
    const data = this.buildUpdateData(dto);

    const updated = await this.customersRepository.updateWithActivityLog(
      customerId,
      data,
      this.customersRepository.toLogValue(current),
      user.userId,
      ipAddress,
    );

    return {
      message: 'Cập nhật Customer thành công.',
      data: this.mapCustomer(updated),
    };
  }

  private async findAccessibleCustomer(
    customerId: number,
    user: AuthenticatedUser,
  ) {
    const customer = await this.customersRepository.findAccessibleById(
      customerId,
      this.getSalesScopeUserId(user),
    );

    if (!customer) {
      throw new NotFoundException(
        'Không tìm thấy Customer hoặc bạn không có quyền truy cập Customer này.',
      );
    }

    return customer;
  }

  private getSalesScopeUserId(user: AuthenticatedUser): number | undefined {
    // BR-02: Sales chỉ được truy cập vào các Customer có liên quan đến Lead hoặc Deal do Sales đó phụ trách
    if (user.role === Role.SALES) {
      return user.userId;
    }

    return undefined;
  }

  private buildUpdateData(dto: UpdateCustomerDto): Prisma.customersUpdateInput {
    return {
      fullname: dto.fullName === undefined ? undefined : dto.fullName.trim(),
      company:
        dto.company === undefined ? undefined : dto.company?.trim() || null,
      phone: dto.phone === undefined ? undefined : dto.phone?.trim() || null,
      email:
        dto.email === undefined
          ? undefined
          : dto.email?.trim().toLowerCase() || null,
      address:
        dto.address === undefined ? undefined : dto.address?.trim() || null,
      customertype:
        dto.customerType === undefined
          ? undefined
          : dto.customerType?.trim() || null,
    };
  }

  private mapCustomer(customer: {
    customerid: number;
    leadid: number | null;
    fullname: string;
    company: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    customertype: string | null;
    createddate: Date | null;
  }) {
    return {
      customerId: customer.customerid,

      customerCode: `CU${String(customer.customerid).padStart(3, '0')}`,

      leadId: customer.leadid,
      fullName: customer.fullname,
      company: customer.company,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      customerType: customer.customertype,
      createdAt: customer.createddate,
    };
  }
}
