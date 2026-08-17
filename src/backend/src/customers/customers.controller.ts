import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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

@ApiTags('Customers')
@ApiBearerAuth('access-token')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SALES, Role.CUSTOMER_CARE)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
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
  @ApiOperation({ summary: 'Xem chi tiết Customer' })
  findOne(
    @Param('id', ParseIntPipe)
    customerId: number,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.customersService.findOne(customerId, request.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin Customer' })
  update(
    @Param('id', ParseIntPipe)
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
