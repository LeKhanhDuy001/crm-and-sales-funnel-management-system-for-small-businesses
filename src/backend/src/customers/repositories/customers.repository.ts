import { Injectable } from '@nestjs/common';
import { action_type, type Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface CustomerFilter {
  search?: string;
  customerType?: string;
  salesUserId?: number;
}

export interface FindCustomersOptions extends CustomerFilter {
  skip: number;
  take: number;
}

const customerSelect = {
  customerid: true,
  leadid: true,
  fullname: true,
  company: true,
  phone: true,
  email: true,
  address: true,
  customertype: true,
  createddate: true,
} satisfies Prisma.customersSelect;

function buildWhere(filter: CustomerFilter): Prisma.customersWhereInput {
  const conditions: Prisma.customersWhereInput[] = [];

  if (filter.search) {
    conditions.push({
      OR: [
        {
          fullname: {
            contains: filter.search,
            mode: 'insensitive',
          },
        },
        {
          company: {
            contains: filter.search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: filter.search,
            mode: 'insensitive',
          },
        },
        {
          phone: { contains: filter.search },
        },
      ],
    });
  }

  if (filter.customerType) {
    conditions.push({
      customertype: {
        equals: filter.customerType,
        mode: 'insensitive',
      },
    });
  }

  if (filter.salesUserId !== undefined) {
    conditions.push({
      OR: [
        {
          leads: { is: { assigneduserid: filter.salesUserId } },
        },
        {
          deals: { some: { assigneduserid: filter.salesUserId } },
        },
      ],
    });
  }

  if (conditions.length === 0) {
    return {};
  }

  return { AND: conditions };
}

function toLogValue(customer: {
  customerid: number;
  leadid: number | null;
  fullname: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  customertype: string | null;
  createddate: Date | null;
}): Prisma.InputJsonObject {
  return {
    customerId: customer.customerid,
    leadId: customer.leadid,
    fullName: customer.fullname,
    company: customer.company,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    customerType: customer.customertype,
    createdAt: customer.createddate?.toISOString() ?? null,
  };
}

@Injectable()
export class CustomersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(options: FindCustomersOptions) {
    const { skip, take, ...filter } = options;

    return this.prisma.customers.findMany({
      where: buildWhere(filter),
      select: customerSelect,
      orderBy: [{ createddate: 'desc' }, { customerid: 'desc' }],
      skip,
      take,
    });
  }

  count(filter: CustomerFilter): Promise<number> {
    return this.prisma.customers.count({
      where: buildWhere(filter),
    });
  }

  findAccessibleById(customerId: number, salesUserId?: number) {
    return this.prisma.customers.findFirst({
      where: {
        customerid: customerId,
        ...buildWhere({ salesUserId }),
      },
      select: customerSelect,
    });
  }

  async updateWithActivityLog(
    customerId: number,
    data: Prisma.customersUpdateInput,
    oldValue: Prisma.InputJsonObject,
    actorUserId: number,
    ipAddress?: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.customers.update({
        where: { customerid: customerId },
        data,
        select: customerSelect,
      });

      await tx.activitylogs.create({
        data: {
          userid: actorUserId,
          action: action_type.Update,
          tablename: 'customers',
          recordid: customerId,
          ipaddress: ipAddress ?? null,

          // BR-18: ghi lại thao tác cập nhật Customer vào activity logs
          oldvalue: oldValue,
          newvalue: toLogValue(updated),
        },
      });

      return updated;
    });
  }

  toLogValue(
    customer: Parameters<typeof toLogValue>[0],
  ): Prisma.InputJsonObject {
    return toLogValue(customer);
  }
}
