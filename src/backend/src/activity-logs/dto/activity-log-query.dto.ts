import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Matches, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { action_type } from '../../../generated/prisma/client';

export class ActivityLogQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'ID người dùng thực hiện thao tác',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'User ID phải là số nguyên.' })
  @Min(1, { message: 'User ID phải lớn hơn 0.' })
  @Max(2_147_483_647, { message: 'User ID không hợp lệ.' })
  userId?: number;

  @ApiPropertyOptional({
    enum: action_type,
    example: action_type.Update,
  })
  @IsOptional()
  @IsEnum(action_type, { message: 'Hành động không hợp lệ.' })
  action?: action_type;

  @ApiPropertyOptional({ example: '2026-08-01' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Ngày bắt đầu phải có định dạng YYYY-MM-DD.',
  })
  fromDate?: string;

  @ApiPropertyOptional({ example: '2026-08-17' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Ngày kết thúc phải có định dạng YYYY-MM-DD.',
  })
  toDate?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
