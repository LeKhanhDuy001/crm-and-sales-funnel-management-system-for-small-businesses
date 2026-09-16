import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = request.body?.token;

    if (typeof token !== 'string' || token.length !== 64) {
      throw new BadRequestException(
        'Reset token không hợp lệ hoặc đã hết hạn',
      );
    }

    await this.authService.validateResetToken(token);

    return true;
  }
}