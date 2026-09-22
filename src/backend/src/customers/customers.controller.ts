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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomersService } from './customers.service';
import { Int32IdPipe } from '../common/pipes/int32-id.pipe';

@ApiTags('Customers')
@ApiBearerAuth('access-token')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Roles(Role.SALES, Role.CUSTOMER_CARE, Role.SALES_MANAGER)
  @ApiOperation({ summary: 'Xem danh sách Customer theo quyền' })
  findAll(
    @Query()
    query: CustomerQueryDto,

    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.customersService.findAll(query, request.user);
  }

  @Get(':id')
  @Roles(Role.SALES, Role.CUSTOMER_CARE)
  @ApiOperation({ summary: 'Xem chi tiết Customer' })
  findOne(
    @Param('id', Int32IdPipe)
    customerId: number,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.customersService.findOne(customerId, request.user);
  }

  @Patch(':id')
  @Roles(Role.SALES, Role.CUSTOMER_CARE)
  @ApiOperation({ summary: 'Cập nhật thông tin Customer' })
  update(
    @Param('id', Int32IdPipe)
    customerId: number,
    @Body()
    dto: UpdateCustomerDto,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.customersService.update(
      customerId,
      dto,
      request.user,
      request.ip,
    );
  }
}
