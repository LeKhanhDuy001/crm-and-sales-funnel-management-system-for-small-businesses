import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Mã định danh của người dùng',
  })
  userId!: number;

  @ApiProperty({
    example: 'Nguyễn Văn An',
    description: 'Họ tên đầy đủ của người dùng',
  })
  fullName!: string;

  @ApiProperty({
    example: 'admin@crm.com',
    description: 'Email đăng nhập của người dùng',
  })
  email!: string;

  @ApiProperty({
    example: '0901234567',
    nullable: true,
    description: 'Số điện thoại của người dùng',
  })
  phone!: string | null;

  @ApiProperty({
    example: 'Admin',
    description: 'Vai trò của người dùng',
  })
  role!: string;
}
