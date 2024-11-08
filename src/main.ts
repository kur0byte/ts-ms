import 'reflect-metadata';
/**
 * @file main.ts
 * @description Entry point for the application. This file contains the bootstrap function which initializes and starts the HTTP application.
 */

import {HTTPApplication} from './infrastructure/http/HTTPBaseServer.abstract';
import {TYPES} from './shared/types';
import {iocContainer} from './ioc/container';

/**
 * Bootstrap the application.
 *
 * This function creates and configures the IoC container, retrieves the HTTP application instance,
 * sets it up, and starts it. If any error occurs during this process, it logs the error and exits the process.
 *
 * @async
 * @function bootstrap
 * @returns {Promise<void>} A promise that resolves when the application has been successfully started.
 */
async function bootstrap(): Promise<void> {
  try {
    // Create and configure container
    const container = iocContainer.getContainer();
    // Create application instance
    const application = container.get<HTTPApplication>(TYPES.Server);

    // Setup and start the application
    await application.setup();
    await application.start();
  } catch (error) {
    console.error('Failed to bootstrap application:', error);
    throw error;
  }
}

// Start the bootstrap process
bootstrap();
