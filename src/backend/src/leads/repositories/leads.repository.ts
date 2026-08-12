import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { LeadQueryDto } from '../dto/lead-query.dto';

@Injectable()
export class LeadsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(query: LeadQueryDto) {
    const { search, status, sourceId, page, limit } = query;

    const where = this.buildWhere(search, status, sourceId);

    return this.prisma.leads.findMany({
      where,
      include: {
        leadsources: true,
        users: {
          select: {
            userid: true,
            fullname: true,
            email: true,
          },
        },
      },
      orderBy: { createddate: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  count(query: LeadQueryDto) {
    const where = this.buildWhere(query.search, query.status, query.sourceId);

    return this.prisma.leads.count({ where });
  }

  findById(leadId: number) {
    return this.prisma.leads.findUnique({
      where: { leadid: leadId },
      include: {
        leadsources: true,
        users: {
          select: {
            userid: true,
            fullname: true,
            email: true,
          },
        },
        customers: true,
      },
    });
  }

  findDuplicate(email?: string, phone?: string, excludeLeadId?: number) {
    const conditions: Prisma.leadsWhereInput[] = [];
    if (email) {
      conditions.push({
        email: {
          equals: email,
          mode: 'insensitive',
        },
      });
    }
    if (phone) {
      conditions.push({ phone });
    }
    if (conditions.length === 0) {
      return null;
    }

    return this.prisma.leads.findFirst({
      where: {
        AND: [
          {
            OR: conditions,
          },
          ...(excludeLeadId
            ? [
                {
                  leadid: {
                    not: excludeLeadId,
                  },
                },
              ]
            : []),
        ],
      },
    });
  }

  findSourceById(sourceId: number) {
    return this.prisma.leadsources.findUnique({
      where: { sourceid: sourceId },
    });
  }

  findUserById(userId: number) {
    return this.prisma.users.findUnique({
      where: { userid: userId },
    });
  }

  findSources() {
    return this.prisma.leadsources.findMany({
      orderBy: { sourcename: 'asc' },
    });
  }

  createWithLog(data: Prisma.leadsUncheckedCreateInput, currentUserId: number) {
    return this.prisma.$transaction(async (transaction) => {
      const lead = await transaction.leads.create({
        data,
        include: {
          leadsources: true,
          users: {
            select: {
              userid: true,
              fullname: true,
              email: true,
            },
          },
          customers: true,
        },
      });

      await transaction.activitylogs.create({
        data: {
          userid: currentUserId,
          action: 'Create',
          tablename: 'leads',
          recordid: lead.leadid,
        },
      });

      return lead;
    });
  }

  updateWithLog(
    leadId: number,
    data: Prisma.leadsUncheckedUpdateInput,
    currentUserId: number,
  ) {
    return this.prisma.$transaction(async (transaction) => {
      const lead = await transaction.leads.update({
        where: { leadid: leadId },
        data,
        include: {
          leadsources: true,
          users: {
            select: {
              userid: true,
              fullname: true,
              email: true,
            },
          },
          customers: true,
        },
      });

      await transaction.activitylogs.create({
        data: {
          userid: currentUserId,
          action: 'Update',
          tablename: 'leads',
          recordid: lead.leadid,
        },
      });

      return lead;
    });
  }

  deleteWithLog(leadId: number, currentUserId: number) {
    return this.prisma.$transaction(async (transaction) => {
      await transaction.leads.delete({
        where: { leadid: leadId },
      });

      await transaction.activitylogs.create({
        data: {
          userid: currentUserId,
          action: 'Delete',
          tablename: 'leads',
          recordid: leadId,
        },
      });
    });
  }

  private buildWhere(
    search?: string,
    status?: string,
    sourceId?: number,
  ): Prisma.leadsWhereInput {
    const normalizedSearch = search?.trim();

    return {
      ...(status ? { status } : {}),
      ...(sourceId ? { sourceid: sourceId } : {}),
      ...(normalizedSearch
        ? {
            OR: [
              {
                fullname: {
                  contains: normalizedSearch,
                  mode: 'insensitive',
                },
              },
              {
                company: {
                  contains: normalizedSearch,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: normalizedSearch,
                  mode: 'insensitive',
                },
              },
              {
                phone: { contains: normalizedSearch },
              },
            ],
          }
        : {}),
    };
  }
}
