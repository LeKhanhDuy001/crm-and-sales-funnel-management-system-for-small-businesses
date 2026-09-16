import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreatePipelineStageData {
  stagename: string;
  stageorder: number;
  probability: number;
}

export interface UpdatePipelineStageData {
  stagename?: string;
  stageorder?: number;
  probability?: number;
}

@Injectable()
export class PipelineStagesRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return this.prisma.pipelinestages.findMany({
      orderBy: {
        stageorder: 'asc',
      },
    });
  }

  async findById(stageId: number) {
    return this.prisma.pipelinestages.findUnique({
      where: {
        stageid: stageId,
      },
    });
  }

  async findByName(stageName: string, excludeStageId?: number) {
    return this.prisma.pipelinestages.findFirst({
      where: {
        stagename: {
          equals: stageName,
          mode: 'insensitive',
        },
        ...(excludeStageId !== undefined
          ? {
            stageid: {
              not: excludeStageId,
            },
          }
          : {}),
      },
    });
  }

  async findByOrder(stageOrder: number, excludeStageId?: number) {
    return this.prisma.pipelinestages.findFirst({
      where: {
        stageorder: stageOrder,
        ...(excludeStageId !== undefined
          ? {
            stageid: {
              not: excludeStageId,
            },
          }
          : {}),
      },
    });
  }

  async countDeals(stageId: number) {
    return this.prisma.deals.count({
      where: {
        stageid: stageId,
      },
    });
  }

  async create(data: CreatePipelineStageData) {
    return this.prisma.pipelinestages.create({
      data,
    });
  }

  async update(stageId: number, data: UpdatePipelineStageData) {
    return this.prisma.pipelinestages.update({
      where: {
        stageid: stageId,
      },
      data,
    });
  }

  async syncDealsProbability(stageId: number, probability: number) {
    return this.prisma.$executeRaw(
      Prisma.sql`
      UPDATE "deals"
      SET
        "probability" = ${probability},
        "expected_revenue" = ROUND(
          ("deal_value" * ${probability}) / 100,
          2
        )
      WHERE "stage_id" = ${stageId}
    `,
    );
  }

  async delete(stageId: number) {
    return this.prisma.pipelinestages.delete({
      where: {
        stageid: stageId,
      },
    });
  }
}