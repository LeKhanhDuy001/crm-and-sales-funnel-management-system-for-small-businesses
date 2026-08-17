import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Gói CRM Standard' })
  @IsString()
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống.' })
  @MaxLength(200, { message: 'Tên sản phẩm không được vượt quá 200 ký tự.' })
  productName!: string;

  @ApiPropertyOptional({ example: 'Phần mềm' })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Danh mục không được vượt quá 100 ký tự.' })
  category?: string;

  @ApiProperty({ example: 1500000 })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Giá sản phẩm phải là số.' })
  @Min(0.01, { message: 'Giá sản phẩm phải lớn hơn 0.' })
  price!: number;

  @ApiPropertyOptional({ example: 'Gói CRM dành cho doanh nghiệp vừa.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
