import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const NORMAL_SESSION_SECONDS = 60 * 60;
const REMEMBERED_SESSION_SECONDS = 60 * 60 * 24 * 7;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Xác thực email và mật khẩu, sau đó trả JWT cùng thông tin người dùng.
   *
   * @param loginDto Email và mật khẩu đăng nhập.
   * @returns JWT access token và thông tin người dùng đã được lọc.
   * @throws UnauthorizedException Khi tài khoản không tồn tại, bị khóa hoặc mật khẩu không chính xác.
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
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

  /**
   * Kiểm tra email có tồn tại để thực hiện chức năng quên mật khẩu.
   *
   * @param forgotPasswordDto Email cần kiểm tra.
   * @returns Thông báo khi email hợp lệ.
   * @throws NotFoundException Khi email không tồn tại.
   */
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const normalizedEmail = forgotPasswordDto.email.trim().toLowerCase();

    const user = await this.usersService.findByEmail(normalizedEmail);

    if (!user) {
      throw new NotFoundException('Email không tồn tại trong hệ thống');
    }

    if (user.status === false) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    return { message: 'Email hợp lệ. Bạn có thể đặt lại mật khẩu.' };
  }

  /**
   * Đặt lại mật khẩu cho người dùng.
   *
   * @param resetPasswordDto Email và mật khẩu mới.
   * @returns Thông báo khi đổi mật khẩu thành công.
   * @throws BadRequestException Khi hai mật khẩu không giống nhau.
   * @throws NotFoundException Khi email không tồn tại.
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const normalizedEmail = resetPasswordDto.email.trim().toLowerCase();

    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp');
    }

    const user = await this.usersService.findByEmail(normalizedEmail);

    if (!user) {
      throw new NotFoundException('Email không tồn tại trong hệ thống');
    }

    if (user.status === false) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    const passwordHash = await bcrypt.hash(resetPasswordDto.newPassword, 12);

    await this.usersService.updatePassword(user.userid, passwordHash);

    return { message: 'Đổi mật khẩu thành công' };
  }
}
