import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './repositories/tasks.repository';
import { TasksService } from './tasks.service';
import { TaskReminderService } from './task-reminder.service';
import { TaskReminderRepository } from './repositories/task-reminder.repository';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
    TaskReminderService,
    TaskReminderRepository,
  ],
  exports: [TasksService],
})
export class TasksModule {}
