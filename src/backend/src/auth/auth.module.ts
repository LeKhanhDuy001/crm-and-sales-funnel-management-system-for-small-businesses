import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import type { SignOptions } from 'jsonwebtoken';
import { AuthRepository } from './repositories/auth.repository';
import { ResetPasswordGuard } from './guards/reset-password.guard';
import { MailModule } from '../common/mail/mail.module';

@Module({
  imports: [
    UsersModule,
    MailModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');

        const jwtExpiresIn = configService.get<string>('JWT_EXPIRES_IN');

        if (!jwtSecret) {
          throw new Error('JWT_SECRET chưa được cấu hình trong file .env');
        }

        if (!jwtExpiresIn) {
          throw new Error('JWT_EXPIRES_IN chưa được cấu hình trong file .env');
        }

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: jwtExpiresIn as SignOptions['expiresIn'],
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    AuthRepository,
    ResetPasswordGuard,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
