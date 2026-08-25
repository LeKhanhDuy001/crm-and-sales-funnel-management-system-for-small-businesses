import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn An' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Họ tên không được để trống.' })
  @MaxLength(100, { message: 'Họ tên tối đa 100 ký tự.' })
  fullName?: string;

  @ApiPropertyOptional({ example: 'Công ty ABC', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(150, { message: 'Tên công ty tối đa 150 ký tự.' })
  company?: string | null;

  @ApiPropertyOptional({ example: '0901234567', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Số điện thoại tối đa 20 ký tự.' })
  phone?: string | null;

  @ApiPropertyOptional({ example: 'customer@example.com', nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  @MaxLength(100, { message: 'Email tối đa 100 ký tự.' })
  email?: string | null;

  @ApiPropertyOptional({ example: '123 Nguyễn Huệ, TP.HCM', nullable: true })
  @IsOptional()
  @IsString()
  address?: string | null;

  @ApiPropertyOptional({ example: 'Doanh nghiệp', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Loại khách hàng tối đa 50 ký tự.' })
  customerType?: string | null;
}
