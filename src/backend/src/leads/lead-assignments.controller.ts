import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { AssignLeadDto } from './dto/assign-lead.dto';
import { LeadAssignmentQueryDto } from './dto/lead-assignment-query.dto';
import { LeadAssignmentsService } from './lead-assignments.service';
import { Int32IdPipe } from '../common/pipes/int32-id.pipe';

@ApiTags('Lead Assignments')
@ApiBearerAuth('access-token')
@Controller('lead-assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SALES_MANAGER)
export class LeadAssignmentsController {
  constructor(private readonly service: LeadAssignmentsService) {}

  @Get()
  findAll(
    @Query()
    query: LeadAssignmentQueryDto,
  ) {
    return this.service.findAll(query);
  }

  @Get('meta')
  getAssignmentMeta() {
    return this.service.getAssignmentMeta();
  }

  @Patch(':leadId')
  assign(
    @Param('leadId', Int32IdPipe)
    leadId: number,
    @Body()
    dto: AssignLeadDto,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.service.assign(leadId, dto.assignedUserId, request.user);
  }
}
