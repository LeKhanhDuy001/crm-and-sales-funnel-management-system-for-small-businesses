import { Module } from '@nestjs/common';
import { PipelineStagesController } from './pipeline-stages.controller';
import { PipelineStagesService } from './pipeline-stages.service';
import { PipelineStagesRepository } from './repositories/pipeline-stages.repository';

@Module({
  controllers: [PipelineStagesController],
  providers: [PipelineStagesService, PipelineStagesRepository],
})
export class PipelineStagesModule {}