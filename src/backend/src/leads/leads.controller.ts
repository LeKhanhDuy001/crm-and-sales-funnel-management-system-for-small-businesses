import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadsService } from './leads.service';
import { ConvertLeadDto } from './dto/convert-lead.dto';
import { Int32IdPipe } from '../common/pipes/int32-id.pipe';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@ApiTags('Leads')
@ApiBearerAuth('access-token')
@Controller('leads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  // BR02: Marketing được quản lý Lead; Sales chỉ được đọc Lead để phục vụ UC3.
  @Get()
  @Roles(Role.MARKETING, Role.SALES)
  findAll(@Query() query: LeadQueryDto, @Req() request: AuthenticatedRequest) {
    return this.leadsService.findAll(query, request.user);
  }

  @Get('sources')
  @Roles(Role.MARKETING, Role.SALES)
  findSources() {
    return this.leadsService.findSources();
  }

  @Get(':id')
  @Roles(Role.MARKETING, Role.SALES)
  findOne(
    @Param('id', Int32IdPipe) leadId: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.leadsService.findOne(leadId, request.user);
  }

  // BR02: Chỉ Marketing được tạo Lead.
  @Post()
  @Roles(Role.MARKETING)
  create(@Body() dto: CreateLeadDto, @Req() request: AuthenticatedRequest) {
    return this.leadsService.create(dto, request.user.userId);
  }

  // BR04: Chỉ Sales được chuyển Lead đủ điều kiện thành Customer.
  @Post('conversions')
  @Roles(Role.SALES)
  convertLead(
    @Body() dto: ConvertLeadDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.leadsService.convertLead(dto.leadId, request.user);
  }

  // BR02: Chỉ Marketing được cập nhật Lead.
  @Patch(':id')
  @Roles(Role.MARKETING)
  update(
    @Param('id', Int32IdPipe) leadId: number,
    @Body() dto: UpdateLeadDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.leadsService.update(leadId, dto, request.user.userId);
  }

  // BR02: Chỉ Marketing được xóa Lead.
  @Delete(':id')
  @Roles(Role.MARKETING)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', Int32IdPipe) leadId: number,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.leadsService.remove(leadId, request.user.userId);
  }
}
