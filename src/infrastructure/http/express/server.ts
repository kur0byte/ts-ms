import 'reflect-metadata';
import {Container, inject, injectable} from 'inversify';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import express, {
  json,
  urlencoded,
  Request,
  Response,
  NextFunction,
} from 'express';
import openapi from '../../../../docs/openapi.json';
import {CustomerHTTPRoutes} from '@Customer/presentation/Customer.routes';
import {register} from 'prom-client';
import {LoggerService} from '@shared/logger/logger';
import {RequestLoggerMiddleware} from '@shared/middleware/request-logger-middleware';

@injectable()
export class ExpressServer {
  private server: express.Application;
  private container: Container;
  private logger: LoggerService;
  private requestLogger: RequestLoggerMiddleware;

  constructor(container: Container) {
    this.server = express();
    this.container = container;

    this.logger = container.get<LoggerService>(LoggerService);
    this.requestLogger = container.get<RequestLoggerMiddleware>(
      RequestLoggerMiddleware
    );

    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    // Add request logging middleware
    this.server.use(this.requestLogger.handle.bind(this.requestLogger));

    // Standard middleware
    this.server.use(urlencoded({extended: true}));
    this.server.use(json());

    // Add correlation ID middleware
    this.server.use((req: Request, res: Response, next: NextFunction) => {
      const correlationId = req.get('X-Correlation-ID') || crypto.randomUUID();
      res.set('X-Correlation-ID', correlationId);
      next();
    });
  }

  private configureRoutes(): void {
    // Swagger documentation
    this.server.use(
      '/docs/api',
      swaggerUi.serve,
      async (_req: any, res: any) => {
        return res.send(swaggerUi.generateHTML(openapi));
      }
    );

    // TypeDoc documentation
    this.server.use(
      '/docs/typedoc',
      express.static(path.join(__dirname, '../../../docs/typedoc'))
    );

    // Customer routes
    this.server.use(
      '/customers',
      CustomerHTTPRoutes(this.server, this.container)
    );

    // Metrics endpoint
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

    // Health check endpoint
    this.server.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
      });

      this.logger.debug('Health check performed', {
        requestId: res.getHeader('X-Request-ID') as string,
      });
    });
  }

  private configureErrorHandling(): void {
    // Global error handler
    this.server.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        this.logger.error('Unhandled error occurred', err, {
          requestId: res.getHeader('X-Request-ID') as string,
          path: req.path,
          method: req.method,
        });

        res.status(500).json({
          error: 'Internal Server Error',
          requestId: res.getHeader('X-Request-ID'),
        });

        next(err);
      }
    );
  }

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

export default ExpressServer;
