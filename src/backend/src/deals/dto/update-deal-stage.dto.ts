import { Type } from 'class-transformer';

import {
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateDealStageDto {
  @Type(() => Number)
  @IsInt({ message: 'Giai đoạn Pipeline không hợp lệ.' })
  @Min(1, { message: 'Giai đoạn Pipeline không hợp lệ.' })
  @Max(2_147_483_647, { message: 'Giai đoạn Pipeline không hợp lệ.' })
  stageId!: number;

  @IsOptional()
  @IsString({ message: 'Lý do thất bại không hợp lệ.' })
  @MaxLength(500, {
    message: 'Lý do thất bại không được vượt quá 500 ký tự.',
  })
  lostReason?: string;
}
