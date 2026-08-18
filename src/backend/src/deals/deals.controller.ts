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

@ApiTags('Deals')
@ApiBearerAuth('access-token')
@Controller('deals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SALES)
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get()
  findAll(@Query() query: DealQueryDto, @Req() request: AuthenticatedRequest) {
    return this.dealsService.findAll(query, request.user);
  }

  @Get('meta')
  getMeta() {
    return this.dealsService.getMeta();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) dealId: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.dealsService.findOne(dealId, request.user);
  }

  @Post()
  create(@Body() dto: CreateDealDto, @Req() request: AuthenticatedRequest) {
    return this.dealsService.create(dto, request.user, request.ip ?? null);
  }

  @Patch(':id')
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) dealId: number,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.dealsService.remove(dealId, request.user, request.ip ?? null);
  }
}
