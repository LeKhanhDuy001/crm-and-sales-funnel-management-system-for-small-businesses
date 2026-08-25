import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { AssignTaskDto } from './dto/assign-task.dto';

@ApiTags('Tasks')
@ApiBearerAuth('access-token')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @Roles(Role.SALES_MANAGER, Role.SALES, Role.CUSTOMER_CARE)
  findAll(
    @Query()
    query: TaskQueryDto,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.tasksService.findAll(query, request.user);
  }

  @Get('meta')
  @Roles(Role.SALES_MANAGER, Role.CUSTOMER_CARE)
  getMeta(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.tasksService.getMeta(request.user);
  }

  @Get(':id')
  @Roles(Role.SALES_MANAGER, Role.SALES, Role.CUSTOMER_CARE)
  findOne(
    @Param('id', ParseIntPipe)
    taskId: number,

    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.tasksService.findOne(taskId, request.user);
  }

  @Post()
  @Roles(Role.SALES_MANAGER, Role.CUSTOMER_CARE)
  create(
    @Body()
    dto: CreateTaskDto,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.tasksService.create(dto, request.user, request.ip);
  }

  @Patch(':id/status')
  @Roles(Role.SALES_MANAGER, Role.CUSTOMER_CARE)
  updateStatus(
    @Param('id', ParseIntPipe)
    taskId: number,
    @Body()
    dto: UpdateTaskStatusDto,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.tasksService.updateStatus(
      taskId,
      dto,
      request.user,
      request.ip,
    );
  }

  @Patch(':id/cancel')
  @Roles(Role.SALES_MANAGER, Role.CUSTOMER_CARE)
  cancel(
    @Param('id', ParseIntPipe)
    taskId: number,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.tasksService.cancel(taskId, request.user, request.ip);
  }

  @Patch(':id/assignment')
  @Roles(Role.SALES_MANAGER)
  assign(
    @Param('id', ParseIntPipe)
    taskId: number,
    @Body()
    dto: AssignTaskDto,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.tasksService.assign(taskId, dto, request.user, request.ip);
  }

  @Patch(':id')
  @Roles(Role.SALES_MANAGER, Role.CUSTOMER_CARE)
  update(
    @Param('id', ParseIntPipe)
    taskId: number,
    @Body()
    dto: UpdateTaskDto,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.tasksService.update(taskId, dto, request.user, request.ip);
  }
}
