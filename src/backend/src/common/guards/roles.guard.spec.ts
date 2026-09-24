import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { Role } from '../enums/role.enum';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  const reflectorMock = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    guard = new RolesGuard(reflectorMock as unknown as Reflector);
  });

  it('cho phép truy cập khi API không khai báo @Roles()', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);

    const context = createContext();

    expect(guard.canActivate(context)).toBe(true);
  });

  it('từ chối khi API yêu cầu role nhưng request không có user', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([Role.ADMIN]);

    const context = createContext();

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('cho phép khi user có role phù hợp', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([Role.ADMIN]);

    const user = createUser(Role.ADMIN);
    const context = createContext(user);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('từ chối khi user không có role được phép', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([Role.ADMIN]);

    const user = createUser(Role.SALES);
    const context = createContext(user);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('cho phép khi user thuộc một trong nhiều role được phép', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([
      Role.SALES,
      Role.CUSTOMER_CARE,
    ]);

    const user = createUser(Role.CUSTOMER_CARE);
    const context = createContext(user);

    expect(guard.canActivate(context)).toBe(true);
  });
});

function createUser(role: Role): AuthenticatedUser {
  return {
    userId: 1,
    fullName: 'Test User',
    email: 'test@example.com',
    role,
  };
}

function createContext(user?: AuthenticatedUser): ExecutionContext {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        user,
      }),
    }),
  } as unknown as ExecutionContext;
}
