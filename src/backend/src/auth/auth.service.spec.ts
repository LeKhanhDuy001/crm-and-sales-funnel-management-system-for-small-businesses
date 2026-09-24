import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { MailService } from '../common/mail/mail.service';
import { UsersService } from '../users/users.service';
import { action_type } from '../../generated/prisma/client';
import { AuthService } from './auth.service';
import { AuthRepository } from './repositories/auth.repository';

describe('AuthService', () => {
  let authService: AuthService;

  let usersService: {
    findByEmail: jest.Mock;
    findById: jest.Mock;
    updatePassword: jest.Mock;
  };

  let jwtService: {
    signAsync: jest.Mock;
  };

  let authRepository: {
    createAuthLog: jest.Mock;
    deleteUnusedResetTokens: jest.Mock;
    createResetToken: jest.Mock;
    findResetTokenByHash: jest.Mock;
    markResetTokenUsed: jest.Mock;
  };

  let mailService: {
    sendPasswordResetEmail: jest.Mock;
  };

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      updatePassword: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    authRepository = {
      createAuthLog: jest.fn(),
      deleteUnusedResetTokens: jest.fn(),
      createResetToken: jest.fn(),
      findResetTokenByHash: jest.fn(),
      markResetTokenUsed: jest.fn(),
    };

    mailService = {
      sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
    };

    process.env.FRONTEND_URL = 'http://localhost:3000';

    authService = new AuthService(
      usersService as unknown as UsersService,
      jwtService as unknown as JwtService,
      authRepository as unknown as AuthRepository,
      mailService as unknown as MailService,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return access token when email and password are correct', async () => {
    const password = 'Demo@12345';

    const passwordHash = await bcrypt.hash(password, 4);

    usersService.findByEmail.mockResolvedValue({
      userid: 1,
      fullname: 'Admin Demo',
      email: 'admin.demo@crm.local',
      passwordhash: passwordHash,
      phone: '0901234567',
      status: true,
      roles: {
        rolename: 'Admin',
      },
    });

    jwtService.signAsync.mockResolvedValue('test-access-token');

    const result = await authService.login(
      {
        email: 'admin.demo@crm.local',
        password,
        rememberMe: false,
      },
      null,
    );

    expect(result.accessToken).toBe('test-access-token');

    expect(result.user).toEqual({
      userId: 1,
      fullName: 'Admin Demo',
      email: 'admin.demo@crm.local',
      phone: '0901234567',
      role: 'Admin',
    });

    expect(usersService.findByEmail).toHaveBeenCalledWith(
      'admin.demo@crm.local',
    );

    expect(jwtService.signAsync).toHaveBeenCalledWith(
      {
        sub: 1,
        email: 'admin.demo@crm.local',
        role: 'Admin',
      },
      {
        expiresIn: 3600,
      },
    );

    expect(authRepository.createAuthLog).toHaveBeenCalledWith(
      1,
      action_type.Login,
      null,
    );
  });

  it('should throw UnauthorizedException when password is incorrect', async () => {
    const passwordHash = await bcrypt.hash('CorrectPassword123', 4);

    usersService.findByEmail.mockResolvedValue({
      userid: 1,
      fullname: 'Admin Demo',
      email: 'admin.demo@crm.local',
      passwordhash: passwordHash,
      phone: null,
      status: true,
      roles: {
        rolename: 'Admin',
      },
    });

    await expect(
      authService.login(
        {
          email: 'admin.demo@crm.local',
          password: 'WrongPassword123',
          rememberMe: false,
        },
        null,
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('should return neutral message and not create token when email does not exist', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    const result = await authService.forgotPassword({
      email: 'unknown@crm.local',
    });

    expect(result).toEqual({
      message: 'Nếu tài khoản tồn tại, yêu cầu đặt lại mật khẩu đã được tạo.',
    });

    expect(authRepository.deleteUnusedResetTokens).not.toHaveBeenCalled();
    expect(authRepository.createResetToken).not.toHaveBeenCalled();
    expect(mailService.sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it('should create hashed reset token and send reset email for valid account', async () => {
    usersService.findByEmail.mockResolvedValue({
      userid: 1,
      email: 'admin.demo@crm.local',
      status: true,
    });

    const result = await authService.forgotPassword({
      email: 'admin.demo@crm.local',
    });

    expect(result).toEqual({
      message: 'Nếu tài khoản tồn tại, yêu cầu đặt lại mật khẩu đã được tạo.',
    });

    expect(authRepository.deleteUnusedResetTokens).toHaveBeenCalledWith(1);
    expect(authRepository.createResetToken).toHaveBeenCalledTimes(1);

    const [userId, tokenHash, expiresAt] = authRepository.createResetToken.mock
      .calls[0] as [number, string, Date];

    expect(userId).toBe(1);
    expect(tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(expiresAt).toBeInstanceOf(Date);

    expect(expiresAt.getTime()).toBeGreaterThan(Date.now() + 14 * 60 * 1000);

    expect(expiresAt.getTime()).toBeLessThanOrEqual(
      Date.now() + 15 * 60 * 1000,
    );

    expect(mailService.sendPasswordResetEmail).toHaveBeenCalledTimes(1);

    const [email, resetUrl] = mailService.sendPasswordResetEmail.mock
      .calls[0] as [string, string];

    expect(email).toBe('admin.demo@crm.local');

    expect(resetUrl).toContain('http://localhost:3000/reset-password?token=');

    const token = new URL(resetUrl).searchParams.get('token');

    expect(token).not.toBeNull();

    const sentTokenHash = createHash('sha256').update(token!).digest('hex');

    expect(sentTokenHash).toBe(tokenHash);
  });

  it('should remove reset token when password reset email cannot be sent', async () => {
    usersService.findByEmail.mockResolvedValue({
      userid: 1,
      email: 'admin.demo@crm.local',
      status: true,
    });

    mailService.sendPasswordResetEmail.mockRejectedValue(
      new Error('Resend unavailable'),
    );

    const result = await authService.forgotPassword({
      email: 'admin.demo@crm.local',
    });

    expect(result).toEqual({
      message: 'Nếu tài khoản tồn tại, yêu cầu đặt lại mật khẩu đã được tạo.',
    });

    expect(authRepository.createResetToken).toHaveBeenCalledTimes(1);
    expect(mailService.sendPasswordResetEmail).toHaveBeenCalledTimes(1);

    expect(authRepository.deleteUnusedResetTokens).toHaveBeenCalledTimes(2);

    expect(authRepository.deleteUnusedResetTokens).toHaveBeenNthCalledWith(
      1,
      1,
    );

    expect(authRepository.deleteUnusedResetTokens).toHaveBeenNthCalledWith(
      2,
      1,
    );
  });

  it('should reject reset password when token is expired', async () => {
    authRepository.findResetTokenByHash.mockResolvedValue({
      resetid: 1,
      userid: 1,
      tokenhash: 'hash',
      expiresat: new Date(Date.now() - 60_000),
      usedat: null,
    });

    await expect(
      authService.resetPassword({
        token: 'a'.repeat(64),
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(usersService.updatePassword).not.toHaveBeenCalled();
    expect(authRepository.markResetTokenUsed).not.toHaveBeenCalled();
  });

  it('should reject reset password when token was already used', async () => {
    authRepository.findResetTokenByHash.mockResolvedValue({
      resetid: 1,
      userid: 1,
      tokenhash: 'hash',
      expiresat: new Date(Date.now() + 60_000),
      usedat: new Date(),
    });

    await expect(
      authService.resetPassword({
        token: 'b'.repeat(64),
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(usersService.updatePassword).not.toHaveBeenCalled();
    expect(authRepository.markResetTokenUsed).not.toHaveBeenCalled();
  });

  it('should reset password and mark token as used when token is valid', async () => {
    authRepository.findResetTokenByHash.mockResolvedValue({
      resetid: 10,
      userid: 1,
      tokenhash: 'hash',
      expiresat: new Date(Date.now() + 15 * 60 * 1000),
      usedat: null,
    });

    usersService.findById.mockResolvedValue({
      userid: 1,
      email: 'admin.demo@crm.local',
      status: true,
    });

    const result = await authService.resetPassword({
      token: 'c'.repeat(64),
      newPassword: 'NewPassword123',
      confirmPassword: 'NewPassword123',
    });

    expect(result).toEqual({
      message: 'Đổi mật khẩu thành công',
    });

    expect(usersService.findById).toHaveBeenCalledWith(1);
    expect(usersService.updatePassword).toHaveBeenCalledTimes(1);

    const [userId, passwordHash] = usersService.updatePassword.mock
      .calls[0] as [number, string];

    expect(userId).toBe(1);

    await expect(bcrypt.compare('NewPassword123', passwordHash)).resolves.toBe(
      true,
    );

    expect(authRepository.markResetTokenUsed).toHaveBeenCalledWith(10);
  });
});
