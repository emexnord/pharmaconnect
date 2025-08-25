import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import configuration from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = configuration(); // Fetch configuration from the 'config' module
  const isProduction = config.app.environment === 'production';

  if (!isProduction) {
    // Configure Swagger (OpenAPI) documentation for the API
    const swagger_config = new DocumentBuilder()
      .setTitle('Pharmaconnect API')
      .setDescription('API documentation for the PharmaConnect application')
      .setVersion(config.app.version ?? '1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT Bearer token',
        },
        'access-token',
      )
      .build();

    const documentFactory = () =>
      SwaggerModule.createDocument(app, swagger_config);
    SwaggerModule.setup('api', app, documentFactory);
  }

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
