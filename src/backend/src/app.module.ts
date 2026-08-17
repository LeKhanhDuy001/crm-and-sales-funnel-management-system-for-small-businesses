import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { resolve } from 'node:path';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { DashboardModule } from './dashboard/dashboard.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { LeadsModule } from './leads/leads.module';
import { ProductsModule } from './products/products.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { CustomersModule } from './customers/customers.module';

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

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000,
          limit: 100,
        },
      ],
      errorMessage: 'Too Many Requests',
    }),

    PrismaModule,
    UsersModule,
    AuthModule,
    DashboardModule,
    LeadsModule,
    ProductsModule,
    ActivityLogsModule,
    CustomersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
