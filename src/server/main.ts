import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { homedir } from 'os';
import { isProduction } from './utils/constants';
import { join } from 'path';

// Main file to start app server

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT || 8055, () => {
    process.env.BOS_DATA_PATH = join(...[homedir(), '.bosgui']);
  });

  if (!process.env.BOS_DATA_PATH) {
    Logger.error('LNDBOSS_DIRECTORY not set');
  }

  Logger.log(`LNDBOSS_DIRECTORY: ${process.env.BOS_DATA_PATH}`);

  Logger.log(`isProduction: ${isProduction}`);

  Logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
