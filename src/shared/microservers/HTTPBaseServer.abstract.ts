import 'reflect-metadata';
import {injectable} from 'inversify';
import path from 'path';
import express, {json, urlencoded, Request, Response} from 'express';
import {register} from 'prom-client';
import {LoggerService} from '../logger/logger';
import {RequestLoggerMiddleware} from '../middleware/requestLogger-middleware';
import helmet from 'helmet';
import {CorrelationIdMiddleware} from '../middleware/correlationId.middleware';
import {ErrorHandlingMiddleware} from '../middleware/errorHandling.middleware';
import {iocContainer} from '../../config/dic/inversify.config';

@injectable()
/**
 * Abstract base class for HTTP servers.
 * Provides common configuration and setup for middleware, routes, and error handling.
 */
export abstract class HTTPBaseServer {
  protected server: express.Application = express();
  protected logger: LoggerService = iocContainer.get(LoggerService);
  protected requestLogger: RequestLoggerMiddleware = iocContainer.get(
    RequestLoggerMiddleware
  );
  protected correlationIdMiddleware: CorrelationIdMiddleware = iocContainer.get(
    CorrelationIdMiddleware
  );
  protected errorHandlingMiddleware: ErrorHandlingMiddleware = iocContainer.get(
    ErrorHandlingMiddleware
  );

  /**
   * Configures the server with middleware, routes, and error handling.
   */
  public configureServer(): void {
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  /**
   * Configures the middleware for the server.
   */
  public configureMiddleware(): void {
    this.server.use(helmet());
    this.server.use(this.requestLogger.handle);
    this.server.use(urlencoded({extended: true}));
    this.server.use(json());
    this.server.use(this.correlationIdMiddleware.handle);
    if (this.configureCustomMiddleware) {
      this.configureCustomMiddleware();
    }
  }

  /**
   * Abstract method to configure custom middleware.
   * Must be implemented by subclasses.
   */
  public abstract configureCustomMiddleware?(): void;

  /**
   * Configures the routes for the server.
   */
  public configureRoutes(): void {
    this.server.use(
      '/docs/typedoc',
      express.static(path.join(__dirname, '../../../docs/typedoc'))
    );

    this.server.get('/metrics', async (req: Request, res: Response) => {
      try {
        res.setHeader('Content-Type', register.contentType);
        const metrics = await register.metrics();
        res.send(metrics);

        this.logger.debug('Metrics retrieved successfully', {
          requestId: res.getHeader('X-Request-ID') as string,
        });
      } catch (error) {
        this.logger.error('Failed to retrieve metrics', error as Error, {
          requestId: res.getHeader('X-Request-ID') as string,
        });
        res.status(500).send('Failed to retrieve metrics');
      }
    });

    this.server.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
      });

      this.logger.debug('Health check performed', {
        requestId: res.getHeader('X-Request-ID') as string,
      });
    });

    if (this.configureCustomRoutes) {
      this.configureCustomRoutes();
    }
  }

  /**
   * Abstract method to configure custom routes.
   * Must be implemented by subclasses.
   */
  protected abstract configureCustomRoutes?(): void;

  /**
   * Configures error handling middleware for the server.
   */
  public configureErrorHandling(): void {
    this.server.use(this.errorHandlingMiddleware.handle);
  }

  /**
   * Starts the server and listens on the specified port.
   */
  public start(): void {
    const port = process.env.PORT || 4500;

    this.server.listen(port, () => {
      this.logger.info('Server started', {
        port,
        environment: process.env.NODE_ENV,
        service: process.env.SERVICE_NAME || 'ts-microservice',
      });
    });
  }
}
