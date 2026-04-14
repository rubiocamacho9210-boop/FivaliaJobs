import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

function validateRequiredEnv() {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required env vars: ${missing.join(', ')}. Copy .env.example to .env and fill required values.`,
    );
  }
}

/** Redirects plain HTTP to HTTPS in production environments. */
function httpsRedirectMiddleware(req: Request, res: Response, next: NextFunction) {
  const forwardedProto = req.headers['x-forwarded-proto'] as string | undefined;
  if (forwardedProto && forwardedProto !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
}

async function bootstrap() {
  validateRequiredEnv();
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'production') {
    app.use(httpsRedirectMiddleware);
  }

  app.use(helmet());

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',').filter(Boolean) || ['http://localhost:8081'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`FivaliaJobs API running on port ${port}`);
}

bootstrap();
