import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserQueryDto {
  @ApiPropertyOptional({
    description: 'Tìm kiếm theo họ tên, email hoặc số điện thoại',
    example: 'admin',
  })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi' })
  @MaxLength(100, { message: 'Từ khóa tìm kiếm không được vượt quá 100 ký tự' })
  search?: string;

  @ApiPropertyOptional({ description: 'Lọc theo Role ID', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Role ID phải là số nguyên' })
  @Min(1, { message: 'Role ID không hợp lệ' })
  roleId?: number;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái tài khoản',
    example: true,
  })
  @IsOptional()
  @Transform((params) => {
    const value: unknown = params.value;

    if (value === true || value === 'true') {
      return true;
    }

    if (value === false || value === 'false') {
      return false;
    }

    return value;
  })
  @IsBoolean({ message: 'Trạng thái phải là true hoặc false' })
  status?: boolean;

  @ApiPropertyOptional({
    description: 'Trang hiện tại',
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Trang phải là số nguyên' })
  @Min(1, { message: 'Trang phải lớn hơn hoặc bằng 1' })
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Số bản ghi mỗi trang',
    default: 20,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit phải là số nguyên' })
  @Min(1, { message: 'Limit phải lớn hơn hoặc bằng 1' })
  @Max(100, { message: 'Limit không được vượt quá 100' })
  limit: number = 20;
}
