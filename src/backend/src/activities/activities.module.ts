import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivitiesRepository } from './repositories/activities.repository';

@Module({
  controllers: [ActivitiesController,],
  providers: [ActivitiesService, ActivitiesRepository,],
})
export class ActivitiesModule {}