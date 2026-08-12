import { ApiProperty } from '@nestjs/swagger';
import { AuthUserResponseDto } from './auth-user-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    example: 'Đăng nhập thành công',
    description: 'Thông báo kết quả đăng nhập',
  })
  message!: string;

  @ApiProperty({
    description: 'JWT access token',
  })
  accessToken!: string;

  @ApiProperty({
    type: AuthUserResponseDto,
    description: 'Thông tin người dùng đăng nhập',
  })
  user!: AuthUserResponseDto;
}
