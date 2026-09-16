import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreatePipelineStageDto } from './dto/create-pipeline-stage.dto';
import { UpdatePipelineStageDto } from './dto/update-pipeline-stage.dto';
import { PipelineStagesService } from './pipeline-stages.service';

@ApiTags('Pipeline Stages')
@ApiBearerAuth('access-token')
@Controller('pipeline-stages')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class PipelineStagesController {
  constructor(
    private readonly pipelineStagesService: PipelineStagesService,
  ) {}

  @Get()
  findAll() {
    return this.pipelineStagesService.findAll();
  }

  @Post()
  create(@Body() dto: CreatePipelineStageDto) {
    return this.pipelineStagesService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) stageId: number,
    @Body() dto: UpdatePipelineStageDto,
  ) {
    return this.pipelineStagesService.update(stageId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) stageId: number,
  ): Promise<void> {
    await this.pipelineStagesService.remove(stageId);
  }
}