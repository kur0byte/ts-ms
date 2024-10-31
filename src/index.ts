import 'reflect-metadata';
import 'dotenv/config';
import 'module-alias/register';
import {iocContainer} from './config/dic/inversify.config';
import {LoggerService} from '@shared/logger/logger';
import {HTTPMicroserviceServer} from './infrastructure/http/express/server';

async function bootstrap() {
  const container = iocContainer;
  const logger = container.get<LoggerService>(LoggerService);

  try {
    logger.info('Application bootstrapping', {
      environment: process.env.NODE_ENV,
      service: process.env.SERVICE_NAME || 'ts-microservice',
    });

    const server = container.get(HTTPMicroserviceServer);
    server.start();
  } catch (error: any) {
    logger.error('Failed to start application:', error);
  }
}

bootstrap();
