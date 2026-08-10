import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  let usersService: {
    findByEmail: jest.Mock;
  };

  let jwtService: {
    signAsync: jest.Mock;
  };

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    authService = new AuthService(
      usersService as unknown as UsersService,
      jwtService as unknown as JwtService,
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

    const result = await authService.login({
      email: 'admin.demo@crm.local',
      password,
      rememberMe: false,
    });

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
      authService.login({
        email: 'admin.demo@crm.local',
        password: 'WrongPassword123',
        rememberMe: false,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });
});
