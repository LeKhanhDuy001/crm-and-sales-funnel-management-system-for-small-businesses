import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const frontendUrl = configService.get<string>('FRONTEND_URL');

  const portValue = configService.get<string>('PORT');

  if (!frontendUrl) {
    throw new Error('FRONTEND_URL chưa được cấu hình trong file .env');
  }

  if (!portValue) {
    throw new Error('PORT chưa được cấu hình trong file .env');
  }

  const port = Number(portValue);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT phải là một số nguyên dương hợp lệ');
  }

  app.setGlobalPrefix('api/v1');
  setupSwagger(app);

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);

  logger.log(`Backend đang chạy trên cổng ${port}`);
}

void bootstrap();
