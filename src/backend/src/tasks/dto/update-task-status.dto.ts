import { IsIn } from 'class-validator';
import { TASK_STATUSES, type TaskStatus } from '../constants/task.constant';

export class UpdateTaskStatusDto {
  @IsIn(TASK_STATUSES, { message: 'Trạng thái Task không hợp lệ.' })
  status!: TaskStatus;
}
