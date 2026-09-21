import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const frontendUrl =
    configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';

  const port = Number(configService.get<string>('PORT') ?? 3001);

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

  await app.listen(port, '0.0.0.0');

  logger.log(`Backend đang chạy trên cổng ${port}`);
}

void bootstrap();
