import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AssignTaskDto {
  @ApiProperty({
    example: 3,
    description: 'ID của nhân viên Sales được phân công Task',
  })
  @IsInt({ message: 'Nhân viên được phân công không hợp lệ.' })
  @Min(1, { message: 'Nhân viên được phân công không hợp lệ.' })
  assignedUserId!: number;
}
