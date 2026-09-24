import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Max,
  Min,
} from 'class-validator';
import { ActivityType } from '../enums/activity-type.enum';

export class CreateActivityDto {
  @IsInt()
  @Min(1)
  @Max(2_147_483_647)
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
