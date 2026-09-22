import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export class UpdateDealDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2_147_483_647)
  customerId?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  dealName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(0)
  dealValue?: number;

  @IsOptional()
  @IsDateString()
  expectedCloseDate?: string;
}
