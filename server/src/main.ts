import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error if unknown props are sent
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  app.enableCors({
    origin: true, // Allow all origins
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
