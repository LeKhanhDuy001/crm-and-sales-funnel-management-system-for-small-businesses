import { Module } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardRepository } from './repositories/dashboard.repository';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, RolesGuard, DashboardRepository],
})
export class DashboardModule {}
