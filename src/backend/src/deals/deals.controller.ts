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
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { DealQueryDto } from './dto/deal-query.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { UpdateDealStageDto } from './dto/update-deal-stage.dto';
import { AssignDealDto } from './dto/assign-deal.dto';

@ApiTags('Deals')
@ApiBearerAuth('access-token')
@Controller('deals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get()
  @Roles(Role.SALES, Role.SALES_MANAGER)
  findAll(@Query() query: DealQueryDto, @Req() request: AuthenticatedRequest) {
    return this.dealsService.findAll(query, request.user);
  }

  @Get('meta')
  @Roles(Role.SALES, Role.SALES_MANAGER)
  getMeta(@Req() request: AuthenticatedRequest) {
    return this.dealsService.getMeta(request.user);
  }

  @Get(':id')
  @Roles(Role.SALES, Role.SALES_MANAGER)
  findOne(
    @Param('id', ParseIntPipe) dealId: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.dealsService.findOne(dealId, request.user);
  }

  @Post()
  @Roles(Role.SALES, Role.SALES_MANAGER)
  create(@Body() dto: CreateDealDto, @Req() request: AuthenticatedRequest) {
    return this.dealsService.create(dto, request.user, request.ip ?? null);
  }

  @Patch(':id/assignment')
  @Roles(Role.SALES_MANAGER, Role.ADMIN)
  assign(
    @Param('id', ParseIntPipe) dealId: number,
    @Body() dto: AssignDealDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.dealsService.assign(dealId, dto, request.user, request.ip);
  }

  @Patch(':id')
  @Roles(Role.SALES, Role.SALES_MANAGER)
  update(
    @Param('id', ParseIntPipe) dealId: number,
    @Body() dto: UpdateDealDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.dealsService.update(
      dealId,
      dto,
      request.user,
      request.ip ?? null,
    );
  }

  @Delete(':id')
  @Roles(Role.SALES, Role.SALES_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) dealId: number,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.dealsService.remove(dealId, request.user, request.ip ?? null);
  }

  @Patch(':id/stage')
  @Roles(Role.SALES)
  async changeStage(
    @Param('id', ParseIntPipe)
    dealId: number,

    @Body()
    dto: UpdateDealStageDto,

    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.dealsService.changeStage(dealId, dto, request.user, request.ip);
  }
}
