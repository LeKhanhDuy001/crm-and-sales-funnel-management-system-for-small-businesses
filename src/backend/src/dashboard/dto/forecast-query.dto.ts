import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, Matches } from 'class-validator';

export class ForecastQueryDto {
  @ApiProperty({
    example: '2026-09-01',
  })
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fromDate!: string;

  @ApiProperty({
    example: '2026-09-30',
  })
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  toDate!: string;
}
