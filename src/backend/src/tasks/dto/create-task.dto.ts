import { Type } from 'class-transformer';

import {
  IsIn,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { TASK_PRIORITIES, type TaskPriority } from '../constants/task.constant';

export class CreateTaskDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Deal không hợp lệ.' })
  @Min(1, { message: 'Deal không hợp lệ.' })
  @Max(2_147_483_647, { message: 'Deal không hợp lệ.' })
  dealId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Người phụ trách không hợp lệ.' })
  @Min(1, { message: 'Người phụ trách không hợp lệ.' })
  @Max(2_147_483_647, { message: 'Người phụ trách không hợp lệ.' })
  assignedUserId?: number;

  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề Task không được để trống.' })
  @MaxLength(200, { message: 'Tiêu đề Task không được vượt quá 200 ký tự.' })
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsISO8601({}, { message: 'Thời hạn hoàn thành không hợp lệ.' })
  dueDate!: string;

  @IsOptional()
  @IsISO8601({}, { message: 'Thời gian nhắc việc không hợp lệ.' })
  reminderTime?: string;

  @IsIn(TASK_PRIORITIES, { message: 'Mức độ ưu tiên không hợp lệ.' })
  priority!: TaskPriority;
}
