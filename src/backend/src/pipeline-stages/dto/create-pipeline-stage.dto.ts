import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePipelineStageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  stageName!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  stageOrder!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  probability!: number;
}
