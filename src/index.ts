import 'reflect-metadata';
import 'dotenv/config';
import 'module-alias/register';
import {iocContainer} from './config/dic/inversify.config';
import ExpressServer from './infrastructure/http/express/server';
import {initDatabase} from './infrastructure/db';

if (process.env.MICROSERVICE === 'HTTP') {
  initDatabase();
  const server = new ExpressServer(iocContainer);
  server.start();
} else {
  console.log('No microservice selected');
}
