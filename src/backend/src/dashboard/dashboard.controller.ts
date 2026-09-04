import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { DashboardService } from './dashboard.service';
import { ForecastService } from './forecast.service';
import { ForecastQueryDto } from './dto/forecast-query.dto';
import { CustomerCareDashboardResponseDto } from './dto/customer-care-dashboard-response.dto';
import { MarketingDashboardResponseDto } from './dto/marketing-dashboard-response.dto';
import { SalesDashboardResponseDto } from './dto/sales-dashboard-response.dto';
import { SalesManagerDashboardResponseDto } from './dto/sales-manager-dashboard-response.dto';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@ApiTags('Dashboard')
@ApiBearerAuth('access-token')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly forecastService: ForecastService,
  ) {}

  @Get('admin')
  @Roles(Role.ADMIN)
  getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get('sales-manager')
  @Roles(Role.SALES_MANAGER)
  @ApiOkResponse({ type: SalesManagerDashboardResponseDto })
  getSalesManagerDashboard() {
    return this.dashboardService.getSalesManagerDashboard();
  }

  @Get('forecast')
  @Roles(Role.SALES_MANAGER, Role.ADMIN)
  getForecast(
    @Query()
    query: ForecastQueryDto,
  ) {
    return this.forecastService.getForecast(query);
  }

  @Get('sales')
  @Roles(Role.SALES)
  @ApiOkResponse({ type: SalesDashboardResponseDto })
  getSalesDashboard(@Req() request: AuthenticatedRequest) {
    return this.dashboardService.getSalesDashboard(request.user.userId);
  }

  @Get('marketing')
  @Roles(Role.MARKETING)
  @ApiOkResponse({
    type: MarketingDashboardResponseDto,
  })
  getMarketingDashboard() {
    return this.dashboardService.getMarketingDashboard();
  }

  @Get('customer-care')
  @Roles(Role.CUSTOMER_CARE)
  @ApiOkResponse({
    type: CustomerCareDashboardResponseDto,
  })
  getCustomerCareDashboard(@Req() request: AuthenticatedRequest) {
    return this.dashboardService.getCustomerCareDashboard(request.user.userId);
  }
}
