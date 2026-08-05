import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({
    default: {
      limit: 5,
      ttl: 60_000,
    },
  })
  @ApiOperation({
    summary: 'Đăng nhập vào hệ thống',
  })
  @ApiOkResponse({
    type: LoginResponseDto,
    description: 'Đăng nhập thành công',
  })
  @ApiUnauthorizedResponse({
    description: 'Email, mật khẩu không chính xác hoặc tài khoản đã bị khóa',
  })
  @ApiTooManyRequestsResponse({
    description: 'Gửi quá nhiều yêu cầu đăng nhập trong thời gian ngắn',
  })
  login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }
}
