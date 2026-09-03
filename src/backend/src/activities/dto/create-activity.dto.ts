import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { ActivityType } from '../enums/activity-type.enum';

export class CreateActivityDto {
  @IsInt()
  dealId!: number;
  @IsEnum(ActivityType, {
    message: 'Loại hoạt động không hợp lệ.',
  })
  activityType!: ActivityType;

  @IsString()
  @IsNotEmpty({
    message: 'Nội dung hoạt động không được để trống.',
  })
  @MaxLength(200)
  subject!: string;

  @IsString()
  @IsNotEmpty({
    message: 'Mô tả hoạt động không được để trống.',
  })
  description!: string;

  @IsDateString(
    {},
    {
      message: 'Thời gian hoạt động không hợp lệ.',
    },
  )
  activityTime!: string;
}
