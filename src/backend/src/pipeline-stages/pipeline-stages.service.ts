import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePipelineStageDto } from './dto/create-pipeline-stage.dto';
import { UpdatePipelineStageDto } from './dto/update-pipeline-stage.dto';
import {
  PipelineStagesRepository,
  UpdatePipelineStageData,
} from './repositories/pipeline-stages.repository';

@Injectable()
export class PipelineStagesService {
  constructor(
    private readonly pipelineStagesRepository: PipelineStagesRepository,
  ) {}

  async findAll() {
    const stages = await this.pipelineStagesRepository.findAll();

    return stages.map((stage) => this.mapStage(stage));
  }

  async create(dto: CreatePipelineStageDto) {
    const stageName = dto.stageName.trim();

    if (!stageName) {
      throw new BadRequestException('Tên giai đoạn không được để trống.');
    }

    this.ensureReservedStageNameIsNotUsed(stageName);

    await this.ensureNameAvailable(stageName);
    await this.ensureOrderAvailable(dto.stageOrder);

    const stage = await this.pipelineStagesRepository.create({
      stagename: stageName,
      stageorder: dto.stageOrder,
      probability: dto.probability,
    });

    return {
      message: 'Tạo giai đoạn Pipeline thành công.',
      data: this.mapStage(stage),
    };
  }

  async update(stageId: number, dto: UpdatePipelineStageDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Không có dữ liệu để cập nhật.');
    }

    const currentStage = await this.requireStage(stageId);

    const stageName =
      dto.stageName !== undefined ? dto.stageName.trim() : undefined;

    if (dto.stageName !== undefined && !stageName) {
      throw new BadRequestException('Tên giai đoạn không được để trống.');
    }

    this.validateSystemStageUpdate(currentStage, dto, stageName);

    if (stageName !== undefined) {
      if (!this.isSystemStage(currentStage.stagename)) {
        this.ensureReservedStageNameIsNotUsed(stageName);
      }

      await this.ensureNameAvailable(stageName, stageId);
    }

    if (dto.stageOrder !== undefined) {
      await this.ensureOrderAvailable(dto.stageOrder, stageId);
    }

    const data: UpdatePipelineStageData = {};

    if (stageName !== undefined) {
      data.stagename = stageName;
    }

    if (dto.stageOrder !== undefined) {
      data.stageorder = dto.stageOrder;
    }

    if (dto.probability !== undefined) {
      data.probability = dto.probability;
    }

    const stage = await this.pipelineStagesRepository.update(stageId, data);

    if (
      dto.probability !== undefined &&
      dto.probability !== currentStage.probability
    ) {
      await this.pipelineStagesRepository.syncDealsProbability(
        stageId,
        dto.probability,
      );
    }

    return {
      message: 'Cập nhật giai đoạn Pipeline thành công.',
      data: this.mapStage(stage),
    };
  }

  async remove(stageId: number) {
    const stage = await this.requireStage(stageId);

    if (this.isSystemStage(stage.stagename)) {
      throw new UnprocessableEntityException(
        'Không thể xóa giai đoạn hệ thống Won hoặc Lost.',
      );
    }

    const dealCount = await this.pipelineStagesRepository.countDeals(stageId);

    if (dealCount > 0) {
      throw new UnprocessableEntityException(
        'Giai đoạn Pipeline đang được Deal sử dụng nên không thể xóa.',
      );
    }

    await this.pipelineStagesRepository.delete(stageId);

    return {
      message: 'Xóa giai đoạn Pipeline thành công.',
    };
  }

  private async requireStage(stageId: number) {
    const stage = await this.pipelineStagesRepository.findById(stageId);

    if (!stage) {
      throw new NotFoundException('Không tìm thấy giai đoạn Pipeline.');
    }

    return stage;
  }

  private async ensureNameAvailable(stageName: string, excludeStageId?: number) {
    const existing = await this.pipelineStagesRepository.findByName(
      stageName,
      excludeStageId,
    );

    if (existing) {
      throw new ConflictException('Tên giai đoạn Pipeline đã tồn tại.');
    }
  }

  private async ensureOrderAvailable(
    stageOrder: number,
    excludeStageId?: number,
  ) {
    const existing = await this.pipelineStagesRepository.findByOrder(
      stageOrder,
      excludeStageId,
    );

    if (existing) {
      throw new ConflictException('Thứ tự giai đoạn Pipeline đã tồn tại.');
    }
  }

  private ensureReservedStageNameIsNotUsed(stageName: string) {
    const normalized = stageName.trim().toLowerCase();

    if (normalized === 'won' || normalized === 'lost') {
      throw new UnprocessableEntityException(
        'Won và Lost là giai đoạn hệ thống, không thể tạo mới.',
      );
    }
  }

  private validateSystemStageUpdate(
    currentStage: {
      stagename: string;
      stageorder: number;
      probability: number;
    },
    dto: UpdatePipelineStageDto,
    stageName?: string,
  ) {
    const normalizedCurrentName = currentStage.stagename.trim().toLowerCase();

    if (!this.isSystemStage(currentStage.stagename)) {
      return;
    }

    if (
      stageName !== undefined &&
      stageName.toLowerCase() !== normalizedCurrentName
    ) {
      throw new UnprocessableEntityException(
        'Không thể đổi tên giai đoạn hệ thống Won hoặc Lost.',
      );
    }

    if (
      dto.stageOrder !== undefined &&
      dto.stageOrder !== currentStage.stageorder
    ) {
      throw new UnprocessableEntityException(
        'Không thể thay đổi thứ tự của giai đoạn hệ thống Won hoặc Lost.',
      );
    }

    const requiredProbability = normalizedCurrentName === 'won' ? 100 : 0;

    if (
      dto.probability !== undefined &&
      dto.probability !== requiredProbability
    ) {
      throw new UnprocessableEntityException(
        normalizedCurrentName === 'won'
          ? 'Probability của giai đoạn Won phải bằng 100.'
          : 'Probability của giai đoạn Lost phải bằng 0.',
      );
    }
  }

  private isSystemStage(stageName: string) {
    const normalized = stageName.trim().toLowerCase();
    return normalized === 'won' || normalized === 'lost';
  }

  private mapStage(stage: {
    stageid: number;
    stagename: string;
    stageorder: number;
    probability: number;
  }) {
    return {
      stageId: stage.stageid,
      stageName: stage.stagename,
      stageOrder: stage.stageorder,
      probability: stage.probability,
    };
  }
}