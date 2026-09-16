import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdatePipelineStageDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  stageName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  stageOrder?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  probability?: number;
}