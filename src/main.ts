import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Security
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': [
            "'self'",
            "'unsafe-inline'",
            'https://cdn.jsdelivr.net',
            'https://vercel.live',
          ],
          'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
          'img-src': ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
          'font-src': ["'self'", 'https://cdn.jsdelivr.net'],
        },
      },
    }),
  );
  app.enableCors(); // Basic CORS

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true, // extra security: reject unknown properties in body
    }),
  );

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Locus API')
    .setDescription(
      'Locus API with JWT Authentication and filtering/pagination.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token generated from /auth/login',
      },
      'bearer', // This name is used to link to decorators
    )
    .addTag('Auth', 'Endpoints related to user authentication')
    .addTag('Locus', 'Endpoints related to Locus records with DB connection')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keeps user logged in upon page refresh
    },
    customCssUrl:
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.2/swagger-ui.css',
    customJs: [
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.2/swagger-ui-bundle.js',
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.2/swagger-ui-standalone-preset.js',
    ],
  });

  await app.listen(3000);
}
bootstrap();
