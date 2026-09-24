import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import type { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { ResetPasswordGuard } from './guards/reset-password.guard';

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
  login(
    @Body() loginDto: LoginDto,
    @Req() request: Request,
  ): Promise<LoginResponseDto> {
    return this.authService.login(loginDto, request.ip ?? null);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Đăng xuất khỏi hệ thống' })
  logout(@Req() request: AuthenticatedRequest): Promise<{ message: string }> {
    return this.authService.logout(request.user, request.ip ?? null);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({
    default: {
      limit: 3,
      ttl: 60_000,
    },
  })
  @ApiTooManyRequestsResponse({
    description: 'Gửi quá nhiều yêu cầu đặt lại mật khẩu trong thời gian ngắn',
  })
  forgotPassword(
    @Body()
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @UseGuards(ResetPasswordGuard)
  @HttpCode(HttpStatus.OK)
  @Throttle({
    default: {
      limit: 5,
      ttl: 60_000,
    },
  })
  @ApiTooManyRequestsResponse({
    description: 'Gửi quá nhiều yêu cầu đặt lại mật khẩu trong thời gian ngắn',
  })
  resetPassword(
    @Body()
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
