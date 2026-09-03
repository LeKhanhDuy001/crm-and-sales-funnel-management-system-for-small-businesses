import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards, Patch, } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityResultDto } from './dto/update-activity-result.dto';

@ApiTags('Activities')
@ApiBearerAuth('access-token')
@Controller('activities')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SALES, Role.CUSTOMER_CARE)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService,) { }

  @Get()
  findAll(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.activitiesService.findAll(request.user,);
  }

  @Get('meta')
  getMeta(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.activitiesService.getMeta(request.user,);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    activityId: number,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.activitiesService.findOne(activityId, request.user,);
  }

  @Post()
  create(
    @Body()
    dto: CreateActivityDto,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.activitiesService.create(dto, request.user, request.ip,);
  }

  @Patch(':id/result')
  updateResult(
    @Param('id', ParseIntPipe)
    activityId: number,
    @Body()
    dto: UpdateActivityResultDto,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.activitiesService.updateResult(
      activityId,
      dto,
      request.user,
      request.ip,
    );
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id', ParseIntPipe)
    activityId: number,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.activitiesService.cancel(
      activityId,
      request.user,
      request.ip,
    );
  }
}