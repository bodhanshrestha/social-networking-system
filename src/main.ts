import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const configService = app.get(ConfigService);

  const PORT = configService.get('PORT') ?? 3000

  app.use(cookieParser())

  // Configure CORS properly to allow cookies
  app.enableCors({
    origin: true, // Or specify your frontend URL like 'http://localhost:3000'
    credentials: true, // This is critical for cookies to work cross-domain
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Apollo-Require-Preflight'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((acc, error) => {
          // Initialize acc as an object, not a string
          if (error.constraints) {
            acc[error.property] = Object.values(error.constraints).join(', ');
          }
          return acc;
        }, {} as Record<string, string>); // Provide correct initial value with type

        return formattedErrors;
      }
    })
  )


  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap();
