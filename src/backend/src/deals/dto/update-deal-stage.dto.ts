import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class UpdateDealStageDto {
  @Type(() => Number)
  @IsInt({ message: 'Giai đoạn Pipeline không hợp lệ.' })
  @Min(1, { message: 'Giai đoạn Pipeline không hợp lệ.' })
  stageId!: number;
}
