import {inject, injectable} from 'inversify';
import {NodeSDK} from '@opentelemetry/sdk-node';
import {
  Context,
  context,
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
  SpanOptions,
  SpanStatusCode,
  trace,
  Tracer,
  Span,
} from '@opentelemetry/api';
import {Resource} from '@opentelemetry/resources';
import {TraceExporter} from '@google-cloud/opentelemetry-cloud-trace-exporter';
import {NextFunction, Request, Response} from 'express';
import {LoggerService} from '../logging/logger';
import {TYPES} from '../../../ioc/types';
import {ConfigService} from '../../config/config.service';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-node';

@injectable()
export class OpenTelemetryTracer {
  private config!: any;
  private sdk!: NodeSDK;
  private currentSpan?: Span;

  constructor(
    @inject(TYPES.LoggerService) private readonly logger: LoggerService,
    @inject(TYPES.ConfigService) private readonly configService: ConfigService
  ) {
    this.initializeConfig();
  }

  private initializeConfig(): void {
    this.config = this.configService.get('ObservabilityConfig');
    this.logger.info('Observability config:', {a: this.config});

    if (this.config.tracing.environment === 'development') {
      diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
    }

    this.setupSDK();
  }

  private setupSDK(): void {
    const traceExporter = new TraceExporter({
      projectId: this.config.gcp.projectId,
      credentials: this.config.gcp.credentials,
    });
    const resource = new Resource({
      'service.name': this.config.tracing.serviceName,
      'service.version': this.config.tracing.serviceVersion,
      environment: this.config.tracing.environment,
      exporter: 'google-cloud-trace-exporter',
    });
    const spanProcessor =
      this.config.environment === 'production'
        ? new BatchSpanProcessor(new TraceExporter())
        : new SimpleSpanProcessor(new ConsoleSpanExporter());

    const instrumentations: any = [
      // new HttpInstrumentation(),
      // new GrpcInstrumentation(),
      // new ExpressInstrumentation(),
      // new MongoDBInstrumentation(),
      // new PgInstrumentation(),
      // new RedisInstrumentation(),
      // new MySqlInstrumentation(),
      // new AwsSdkInstrumentation(),
      // new AwsInstrumentation(),
      // new HttpInstrumentation(),
      // new GrpcInstrumentation(),
      // new ExpressInstrumentation(),
      // new MongoDBInstrumentation(),
      // new PgInstrumentation(),
      // new RedisInstrumentation(),
      // new MySqlInstrumentation(),
      // new AwsSdkInstrumentation(),
      // new AwsInstrumentation(),
    ];
    this.sdk = new NodeSDK({
      resource,
      traceExporter,
      spanProcessors: [spanProcessor],
      instrumentations,
    });
  }

  public async initialize(): Promise<void> {
    try {
      await this.sdk.start();
      this.logger.info('Tracing initialized', {
        service: this.config.tracing.serviceName,
        environment: this.config.tracing.environment,
      });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Failed to initialize tracing', error);
      }
      throw error;
    }
  }

  public async shutdown(): Promise<void> {
    try {
      await this.sdk.shutdown();
      this.logger.info('Tracing shut down');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Failed to shutdown tracing', error);
      }
      throw error;
    }
  }

  getCurrentSpan(): Span | undefined {
    return trace.getSpan(context.active());
  }

  public endSpan(): void {
    if (this.currentSpan) {
      this.currentSpan.end();
      this.currentSpan = undefined;
    }
  }

  public addAttribute(key: string, value: string | number | boolean): void {
    if (this.currentSpan) {
      this.currentSpan.setAttribute(key, value);
    }
  }

  public setError(error: Error): void {
    if (this.currentSpan) {
      this.currentSpan.recordException(error);
      this.currentSpan.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
    }
  }

  public getTraceId(): string | undefined {
    return this.currentSpan?.spanContext().traceId;
  }

  public startSpan(name: string, options?: SpanOptions): Span {
    this.currentSpan = trace.getTracer('default').startSpan(name, options);
    return this.currentSpan;
  }

  public middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const span = trace.getTracer('default').startSpan('http_request', {
        attributes: {
          'http.method': req.method,
          'http.url': req.url,
        },
      });

      context.with(trace.setSpan(context.active(), span), () => {
        res.on('finish', () => {
          span.setAttribute('http.status_code', res.statusCode);
          span.end();
        });

        next();
      });
    };
  }
}
