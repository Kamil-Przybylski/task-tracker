/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import fastifyCookie from '@fastify/cookie';
import { IConfig } from '@libs/core-api';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const cs: ConfigService<IConfig> = app.get(ConfigService);
  const globalPrefix = cs.get('API_PREFIX');
  const port = cs.get('API_PORT');
  const apiCookiesSecret = cs.get('API_COOKIES_SECRET');

  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: ['http://localhost:4200'],
    credentials: true,
  });
  await app.register(fastifyCookie, {
    secret: apiCookiesSecret,
  });
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
