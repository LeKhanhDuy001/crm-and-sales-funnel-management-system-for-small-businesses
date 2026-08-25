import { Module } from '@nestjs/common';
import { ActivityLogsController } from './activity-logs.controller';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLogsRepository } from './repositories/activity-logs.repository';

@Module({
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService, ActivityLogsRepository],
})
export class ActivityLogsModule {}
