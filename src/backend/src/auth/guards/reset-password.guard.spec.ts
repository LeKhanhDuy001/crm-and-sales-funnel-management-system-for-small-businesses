import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ResetPasswordGuard } from './reset-password.guard';

describe('ResetPasswordGuard', () => {
  let guard: ResetPasswordGuard;

  let authService: {
    validateResetToken: jest.Mock;
  };

  const createExecutionContext = (
    body: Record<string, unknown>,
  ): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          body,
        }),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    authService = {
      validateResetToken: jest.fn(),
    };

    guard = new ResetPasswordGuard(authService as unknown as AuthService);
  });

  it('should reject when reset token is missing', async () => {
    const context = createExecutionContext({});

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(authService.validateResetToken).not.toHaveBeenCalled();
  });

  it('should reject when reset token has invalid length', async () => {
    const context = createExecutionContext({
      token: 'invalid-token',
    });

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(authService.validateResetToken).not.toHaveBeenCalled();
  });

  it('should allow request when reset token is valid', async () => {
    const token = 'a'.repeat(64);

    authService.validateResetToken.mockResolvedValue({
      resetid: 1,
      userid: 1,
      tokenhash: 'hash',
      expiresat: new Date(Date.now() + 60_000),
      usedat: null,
    });

    const context = createExecutionContext({
      token,
    });

    await expect(guard.canActivate(context)).resolves.toBe(true);

    expect(authService.validateResetToken).toHaveBeenCalledWith(token);
  });

  it('should reject when reset token is expired or already used', async () => {
    const token = 'b'.repeat(64);

    authService.validateResetToken.mockRejectedValue(
      new BadRequestException('Reset token không hợp lệ hoặc đã hết hạn'),
    );

    const context = createExecutionContext({
      token,
    });

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(authService.validateResetToken).toHaveBeenCalledWith(token);
  });
});
