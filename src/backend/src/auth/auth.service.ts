import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { action_type } from '../../generated/prisma/client';
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { AuthRepository } from './repositories/auth.repository';
import { MailService } from '../common/mail/mail.service';

const NORMAL_SESSION_SECONDS = 60 * 60;
const REMEMBERED_SESSION_SECONDS = 60 * 60 * 24 * 7;
const RESET_TOKEN_EXPIRY_MINUTES = 15;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly mailService: MailService,
  ) {}

  /**
   * Xác thực email và mật khẩu, sau đó trả JWT cùng thông tin người dùng.
   *
   * @param loginDto Email và mật khẩu đăng nhập.
   * @returns JWT access token và thông tin người dùng đã được lọc.
   * @throws UnauthorizedException Khi tài khoản không tồn tại, bị khóa hoặc mật khẩu không chính xác.
   */
  async login(
    loginDto: LoginDto,
    ipAddress: string | null,
  ): Promise<LoginResponseDto> {
    const normalizedEmail = loginDto.email.trim().toLowerCase();

    const user = await this.usersService.findByEmail(normalizedEmail);

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    if (user.status === false) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    const passwordIsValid = await bcrypt.compare(
      loginDto.password,
      user.passwordhash,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const payload: JwtPayload = {
      sub: user.userid,
      email: user.email,
      role: user.roles.rolename,
    };

    const expiresIn =
      loginDto.rememberMe === true
        ? REMEMBERED_SESSION_SECONDS
        : NORMAL_SESSION_SECONDS;

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn,
    });

    // BR18: Đăng nhập thành công phải ghi Activity Log.
    await this.authRepository.createAuthLog(
      user.userid,
      action_type.Login,
      ipAddress,
    );

    return {
      message: 'Đăng nhập thành công',
      accessToken,
      user: {
        userId: user.userid,
        fullName: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.roles.rolename,
      },
    };
  }

  async logout(
    user: AuthenticatedUser,
    ipAddress: string | null,
  ): Promise<{ message: string }> {
    // BR18: Đăng xuất chủ động phải được ghi Activity Log.
    await this.authRepository.createAuthLog(
      user.userId,
      action_type.Logout,
      ipAddress,
    );

    return { message: 'Đăng xuất thành công' };
  }

  /**
   * Đặt lại mật khẩu bằng reset token hợp lệ.
   * Luôn trả cùng một thông báo để tránh làm lộ email có tồn tại hay không.
   */
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const normalizedEmail = forgotPasswordDto.email.trim().toLowerCase();

    const response = {
      message: 'Nếu tài khoản tồn tại, yêu cầu đặt lại mật khẩu đã được tạo.',
    };

    const user = await this.usersService.findByEmail(normalizedEmail);

    if (!user || user.status === false) {
      return response;
    }

    const resetToken = randomBytes(32).toString('hex');

    const tokenHash = createHash('sha256').update(resetToken).digest('hex');

    const expiresAt = new Date(
      Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000,
    );

    await this.authRepository.deleteUnusedResetTokens(user.userid);

    await this.authRepository.createResetToken(
      user.userid,
      tokenHash,
      expiresAt,
    );

    const frontendUrl = process.env.FRONTEND_URL?.trim().replace(/\/+$/, '');

    if (!frontendUrl) {
      await this.authRepository.deleteUnusedResetTokens(user.userid);

      this.logger.error('FRONTEND_URL chưa được cấu hình.');

      return response;
    }

    const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

    try {
      await this.mailService.sendPasswordResetEmail(user.email, resetUrl);
    } catch {
      await this.authRepository.deleteUnusedResetTokens(user.userid);

      this.logger.error(
        `Không thể gửi email đặt lại mật khẩu cho userId=${user.userid}.`,
      );
    }

    return response;
  }

  async validateResetToken(token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const resetToken =
      await this.authRepository.findResetTokenByHash(tokenHash);

    if (
      !resetToken ||
      resetToken.usedat !== null ||
      resetToken.expiresat <= new Date()
    ) {
      throw new BadRequestException('Reset token không hợp lệ hoặc đã hết hạn');
    }

    return resetToken;
  }

  /**
   * Đặt lại mật khẩu bằng reset token hợp lệ.
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp');
    }

    const resetToken = await this.validateResetToken(resetPasswordDto.token);

    const user = await this.usersService.findById(resetToken.userid);

    if (!user || user.status === false) {
      throw new BadRequestException('Reset token không hợp lệ hoặc đã hết hạn');
    }

    const passwordHash = await bcrypt.hash(resetPasswordDto.newPassword, 12);

    await this.usersService.updatePassword(user.userid, passwordHash);

    await this.authRepository.markResetTokenUsed(resetToken.resetid);

    return { message: 'Đổi mật khẩu thành công' };
  }
}
