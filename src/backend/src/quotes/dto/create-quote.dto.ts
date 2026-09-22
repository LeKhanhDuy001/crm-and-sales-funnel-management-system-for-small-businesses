import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateQuoteItemDto {
  @Type(() => Number)
  @IsInt({ message: 'Sản phẩm không hợp lệ.' })
  @Min(1, { message: 'Sản phẩm không hợp lệ.' })
  @Max(2_147_483_647, { message: 'Sản phẩm không hợp lệ.' })
  productId!: number;

  @Type(() => Number)
  @IsInt({ message: 'Số lượng phải là số nguyên.' })
  @Min(1, { message: 'Số lượng sản phẩm phải lớn hơn 0.' })
  quantity!: number;
}

export class CreateQuoteDto {
  @Type(() => Number)
  @IsInt({ message: 'Deal không hợp lệ.' })
  @Min(1, { message: 'Deal không hợp lệ.' })
  @Max(2_147_483_647, { message: 'Deal không hợp lệ.' })
  dealId!: number;

  @IsArray({ message: 'Danh sách sản phẩm không hợp lệ.' })
  @ArrayMinSize(1, { message: 'Báo giá phải có ít nhất một sản phẩm.' })
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteItemDto)
  items!: CreateQuoteItemDto[];
}
