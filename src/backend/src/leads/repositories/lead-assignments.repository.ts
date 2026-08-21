import { Injectable } from '@nestjs/common';
import { action_type } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

interface FindAssignmentLeadsParams {
  search?: string;
  page: number;
  limit: number;
}

interface AssignLeadParams {
  leadId: number;
  assignedUserId: number;
  actorUserId: number;
  leadName: string;
}

@Injectable()
export class LeadAssignmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: FindAssignmentLeadsParams) {
    const search = params.search?.trim();
    const where = search
      ? {
          OR: [
            {
              fullname: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
            {
              email: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
            {
              company: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {};

    const skip = (params.page - 1) * params.limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.leads.findMany({
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
        skip,
        take: params.limit,
      }),

      this.prisma.leads.count({ where }),
    ]);

    return { data, total };
  }

  async findLeadById(leadId: number) {
    return this.prisma.leads.findUnique({
      where: { leadid: leadId },
      select: {
        leadid: true,
        fullname: true,
        status: true,
        assigneduserid: true,
      },
    });
  }

  async findActiveSales() {
    return this.prisma.users.findMany({
      where: {
        status: true,
        roles: { rolename: 'Sales' },
      },
      select: {
        userid: true,
        fullname: true,
        email: true,
      },
      orderBy: { fullname: 'asc' },
    });
  }

  async findActiveSalesById(userId: number) {
    return this.prisma.users.findFirst({
      where: {
        userid: userId,
        status: true,
        roles: { rolename: 'Sales' },
      },
      select: {
        userid: true,
        fullname: true,
        email: true,
      },
    });
  }

  async assignLead(params: AssignLeadParams): Promise<void> {
    await this.prisma.$transaction(async (transaction) => {
      await transaction.leads.update({
        where: { leadid: params.leadId },
        data: {
          assigneduserid: params.assignedUserId,
        },
      });

      await transaction.notifications.create({
        data: {
          userid: params.assignedUserId,
          title: 'Bạn được phân công Lead',
          content: `Bạn được phân công phụ trách Lead "${params.leadName}".`,
          type: 'LeadAssignment',
          isread: false,
        },
      });

      await transaction.activitylogs.create({
        data: {
          userid: params.actorUserId,
          action: action_type.Assign,
          tablename: 'leads',
          recordid: params.leadId,
        },
      });
    });
  }
}
