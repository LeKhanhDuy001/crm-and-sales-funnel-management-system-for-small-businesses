import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import type { Request } from 'express';

describe('AuthController', () => {
  let authController: AuthController;

  let authService: {
    login: jest.Mock;
    forgotPassword: jest.Mock;
    resetPassword: jest.Mock;
  };

  beforeEach(() => {
    authService = {
      login: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    };

    authController = new AuthController(authService as unknown as AuthService);
  });

  it('should call AuthService.login and return result', async () => {
    const loginDto: LoginDto = {
      email: 'admin@crm.com',
      password: 'Demo@12345',
      rememberMe: false,
    };

    const expectedResult = {
      message: 'Đăng nhập thành công',
      accessToken: 'test-token',
      user: {
        userId: 1,
        fullName: 'Admin Demo',
        email: 'admin@crm.com',
        phone: null,
        role: 'Admin',
      },
    };

    authService.login.mockResolvedValue(expectedResult);

    const request = { ip: '127.0.0.1' } as unknown as Request;

    const result = await authController.login(loginDto, request);

    expect(authService.login).toHaveBeenCalledWith(loginDto, '127.0.0.1');

    expect(result).toEqual(expectedResult);
  });

  it('should call forgotPassword with email', async () => {
    const forgotPasswordDto: ForgotPasswordDto = { email: 'admin@crm.com' };

    const expectedResult = {
      message: 'Nếu tài khoản tồn tại, yêu cầu đặt lại mật khẩu đã được tạo.',
    };

    authService.forgotPassword.mockResolvedValue(expectedResult);

    const result = await authController.forgotPassword(forgotPasswordDto);

    expect(authService.forgotPassword).toHaveBeenCalledWith(forgotPasswordDto);

    expect(result).toEqual(expectedResult);
  });

  it('should call resetPassword with new password data', async () => {
    const resetPasswordDto: ResetPasswordDto = {
      token: 'a'.repeat(64),
      newPassword: 'NewPassword123',
      confirmPassword: 'NewPassword123',
    };

    const expectedResult = { message: 'Đổi mật khẩu thành công' };

    authService.resetPassword.mockResolvedValue(expectedResult);

    const result = await authController.resetPassword(resetPasswordDto);

    expect(authService.resetPassword).toHaveBeenCalledWith(resetPasswordDto);

    expect(result).toEqual(expectedResult);
  });
});
