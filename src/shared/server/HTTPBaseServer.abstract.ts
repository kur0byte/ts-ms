import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import express, {
  json,
  urlencoded,
  Request,
  Response,
  NextFunction,
} from 'express';
import {register} from 'prom-client';
import {LoggerService} from '@shared/logger/logger';
import {RequestLoggerMiddleware} from '@shared/middleware/request-logger-middleware';

@injectable()
export class HTTPBaseServer {
  protected server: express.Application;
  protected logger: LoggerService;
  protected requestLogger: RequestLoggerMiddleware;

  constructor(logger: LoggerService) {
    this.server = express();
    this.logger = logger;

    this.requestLogger = new RequestLoggerMiddleware(logger);
    this.configureMiddleware();
    // this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    this.server.use(this.requestLogger.handle);
    this.server.use(urlencoded({extended: true}));
    this.server.use(json());

    this.server.use((req: Request, res: Response, next: NextFunction) => {
      const correlationId = req.get('X-Correlation-ID') || crypto.randomUUID();
      res.set('X-Correlation-ID', correlationId);
      next();
    });
  }

  protected configureRoutes(): void {
    this.server.use(
      '/docs/typedoc',
      express.static(path.join(__dirname, '../../../docs/typedoc'))
    );

    this.configureDomainRoutes();

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
  }

  protected configureDomainRoutes(): void {
    throw new Error('Method not implemented');
  }

  private configureErrorHandling(): void {
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
