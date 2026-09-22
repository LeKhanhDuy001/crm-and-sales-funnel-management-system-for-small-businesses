import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class ConvertLeadDto {
  @ApiProperty({
    example: 1,
    description: 'ID của Lead cần chuyển thành Customer',
  })
  @IsInt({
    message: 'Lead ID phải là số nguyên',
  })
  @Min(1, {
    message: 'Lead ID không hợp lệ',
  })
  @Max(2_147_483_647, {
    message: 'Lead ID không hợp lệ',
  })
  leadId!: number;
}