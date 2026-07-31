import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const frontendUrl =
    configService.get<string>('FRONTEND_URL') ??
    'http://localhost:3000';

  const port =
    configService.get<number>('PORT') ?? 3001;

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);

  console.log(
    `Backend đang chạy tại http://localhost:${port}`,
  );
}

void bootstrap();