import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { resolve } from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(process.cwd(), '.env'),
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string()
          .uri({
            scheme: ['postgresql', 'postgres'],
          })
          .required(),

        JWT_SECRET: Joi.string().min(32).required(),

        JWT_EXPIRES_IN: Joi.string()
          .pattern(/^\d+[smhd]$/)
          .required(),

        PORT: Joi.number().port().required(),

        FRONTEND_URL: Joi.string()
          .uri({
            scheme: ['http', 'https'],
          })
          .required(),
      }),
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
      },
    }),

    PrismaModule,
    UsersModule,
    AuthModule,
    DashboardModule,
  ],
})
export class AppModule {}
