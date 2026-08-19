import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateQuoteItemDto } from './create-quote.dto';

export class UpdateQuoteDto {
  @IsArray({ message: 'Danh sách sản phẩm không hợp lệ.' })
  @ArrayMinSize(1, { message: 'Báo giá phải có ít nhất một sản phẩm.' })
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteItemDto)
  items!: CreateQuoteItemDto[];
}
