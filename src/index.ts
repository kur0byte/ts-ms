import 'reflect-metadata';
import 'dotenv/config';
import 'module-alias/register';
import {iocContainer} from './config/dic/inversify.config';
import ExpressServer from './infrastructure/http/express/server';
import {LoggerService} from '@shared/logger/logger';

async function bootstrap() {
  // Configure IoC container
  const container = iocContainer;

  // Get logger instance
  const logger = container.get<LoggerService>(LoggerService);
  try {
    logger.info('Application bootstrapping', {
      environment: process.env.NODE_ENV,
      service: process.env.SERVICE_NAME || 'ts-microservice',
    });

    // Create and start server
    const server = new ExpressServer(container);
    server.start();
  } catch (error: any) {
    logger.error('Failed to start application:', error);
  }
}

bootstrap();
