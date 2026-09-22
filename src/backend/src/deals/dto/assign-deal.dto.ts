import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class AssignDealDto {
  @Type(() => Number)
  @IsInt({ message: 'Nhân viên Sales không hợp lệ.' })
  @Min(1, { message: 'Nhân viên Sales không hợp lệ.' })
  @Max(2_147_483_647, { message: 'Nhân viên Sales không hợp lệ.' })
  assignedUserId!: number;
}
