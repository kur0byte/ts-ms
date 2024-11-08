import 'reflect-metadata';
import {InversifyExpressServer} from 'inversify-express-utils';
import express from 'express';
import {createServer} from 'http';
import {inject, injectable} from 'inversify';
import {LoggerService} from '../observability/logging/logger';
import {TYPES} from '../../ioc/types';
import {CorrelationIdMiddleware} from './middlewares/correlationId.middleware';
import {RequestLoggerMiddleware} from './middlewares/requestLogger-middleware';
import {CorsMiddleware} from './middlewares/cors.middleware';
import {HelmetMiddleware} from './middlewares/helmet.middleware';
import {RateLimitMiddleware} from './middlewares/rate-limit.middleware';
import {OpenTelemetryTracer} from '../observability/tracing/opentelemetry.tracer';
import {iocContainer} from '../../ioc/container';
import {ConfigService} from '../config/config.service';
import {CloudProfiler} from '../observability/profiler/profiler';

@injectable()
export class HTTPApplication {
  private server!: InversifyExpressServer;
  private httpServer: any;
  private container = iocContainer.getContainer();
  private config;

  constructor(
    // @inject(TYPES.Container) private readonly container: Container,
    @inject(TYPES.LoggerService) private readonly logger: LoggerService,
    @inject(TYPES.CorrelationIdMiddleware)
    private readonly correlationIdMiddleware: CorrelationIdMiddleware,
    @inject(TYPES.RequestLoggerMiddleware)
    private readonly requestLoggerMiddleware: RequestLoggerMiddleware,
    @inject(TYPES.CorsMiddleware)
    private readonly corsMiddleware: CorsMiddleware,
    @inject(TYPES.HelmetMiddleware)
    private readonly helmetMiddleware: HelmetMiddleware,
    @inject(TYPES.RateLimitMiddleware)
    private readonly rateLimitMiddleware: RateLimitMiddleware,
    // @inject(TYPES.MetricsService) private readonly metricsService: MetricsService,
    // @inject(TYPES.HealthService) private readonly healthService: HealthService,
    @inject(TYPES.OpenTelemetryTracer)
    private readonly tracingService: OpenTelemetryTracer,
    // @inject(TYPES.TracingService) private readonly tracingService: TracingService
    @inject(TYPES.ConfigService) private readonly configService: ConfigService,
    @inject(TYPES.CloudProfiler) private readonly cloudProfiler: CloudProfiler
  ) {
    this.config = this.configService.get('HttpConfig');
  }

  public async setup(): Promise<void> {
    // Initialize tracing before setting up the server
    await this.tracingService.initialize();

    // Initialize the cloud profiler
    await this.cloudProfiler.start();

    this.server = new InversifyExpressServer(this.container, null, {
      rootPath: '/api/v1',
    });

    this.setupServer();
  }

  private setupServer(): void {
    this.server
      .setConfig(app => this.configureApplication(app))
      .setErrorConfig(app => this.configureErrorHandling(app));

    const app = this.server.build();
    this.httpServer = createServer(app);
  }

  private configureApplication(app: express.Application): void {
    app.use(this.rateLimitMiddleware.handle);
    // Basic middleware
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    // app.use(compression());
    app.use(this.helmetMiddleware.handle);
    app.use(this.correlationIdMiddleware.handle);
    app.use(this.requestLoggerMiddleware.handle);
    app.use(this.corsMiddleware.handle);

    // Add OpenTelemetry middleware
    app.use(this.tracingService.middleware());
  }

  private configureErrorHandling(app: express.Application): void {
    // app.use(errorHandler(this.logger));
  }

  public async start(): Promise<void> {
    try {
      await new Promise<void>(resolve => {
        this.httpServer.listen(this.config.port, () => {
          this.logger.info(`Server running on port ${this.config.port}`);
          resolve();
        });
      });

      this.registerShutdownHandlers();
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Failed to start server', error);
      }
      throw error;
    }
  }

  private registerShutdownHandlers(): void {
    const shutdown = async () => {
      this.logger.info('Shutting down server...');

      this.httpServer.close(async () => {
        try {
          await this.tracingService.shutdown();
          // await this.metricsService.shutdown();
          // await this.healthService.shutdown();

          this.logger.info('Server shutdown complete');
          return;
        } catch (error) {
          if (error instanceof Error) {
            this.logger.error('Error during shutdown', error);
          }
          return;
        }
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  }
}
