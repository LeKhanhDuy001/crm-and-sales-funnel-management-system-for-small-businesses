import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

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

    const accessToken = await this.jwtService.signAsync(payload);

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
}
