import { Module } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ForecastService } from './forecast.service';
import { DashboardRepository } from './repositories/dashboard.repository';
import { ForecastRepository } from './repositories/forecast.repository';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    ForecastService,
    RolesGuard,
    DashboardRepository,
    ForecastRepository,
  ],
})
export class DashboardModule {}
