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
import {HttpInstrumentation} from '@opentelemetry/instrumentation-http';
import {ObservabilityConfig} from '../../config/observability.config';

@injectable()
export class OpenTelemetryTracer {
  private config!: ObservabilityConfig;
  private sdk!: NodeSDK;
  private tracer!: Tracer;

  constructor(
    @inject(TYPES.LoggerService) private readonly logger: LoggerService,
    @inject(TYPES.ConfigService) private readonly configService: ConfigService
  ) {
    this.initializeConfig();
  }

  private initializeConfig(): void {
    this.config = this.configService.get(
      'ObservabilityConfig'
    ) as ObservabilityConfig;
    this.logger.info('Observability config:', {...this.config});

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
      this.config.tracing.environment === 'production'
        ? new BatchSpanProcessor(traceExporter)
        : new SimpleSpanProcessor(new ConsoleSpanExporter());

    const instrumentations = [
      new HttpInstrumentation(),
      // ... other instrumentations ...
    ];

    this.sdk = new NodeSDK({
      resource,
      traceExporter,
      spanProcessors: [spanProcessor],
      instrumentations,
    });

    this.tracer = trace.getTracer('default');
  }

  public async initialize(): Promise<void> {
    try {
      await this.sdk.start();
      this.logger.info('Tracing initialized', {
        service: this.config.tracing.serviceName,
        environment: this.config.tracing.environment,
      });
    } catch (error) {
      this.logger.error('Failed to initialize tracing', error as Error);
      throw error;
    }
  }

  public async shutdown(): Promise<void> {
    try {
      await this.sdk.shutdown();
      this.logger.info('Tracing shut down');
    } catch (error) {
      this.logger.error('Failed to shutdown tracing', error as Error);
      throw error;
    }
  }

  public endSpan(): void {
    const span = trace.getSpan(context.active());
    if (span) {
      span.end();
    }
  }

  public addAttribute(key: string, value: string | number | boolean): void {
    const span = trace.getSpan(context.active());
    if (span) {
      span.setAttribute(key, value);
    }
  }

  public setError(error: Error): void {
    const span = trace.getSpan(context.active());
    if (span) {
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
    }
  }

  public getTraceId(): string | undefined {
    const span = trace.getSpan(context.active());
    return span?.spanContext().traceId;
  }

  public startSpan(name: string, options?: SpanOptions): Span {
    return this.tracer.startSpan(name, options);
  }

  public middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const span = this.tracer.startSpan('http_request', {
        attributes: {
          'http.method': req.method,
          'http.url': req.url,
        },
      });

      try {
        context.with(trace.setSpan(context.active(), span), () => {
          res.on('finish', () => {
            span.setAttribute('http.status_code', res.statusCode);
            span.end();
          });
          res.on('error', error => {
            this.setError(error);
            span.end();
          });

          next();
        });
      } catch (error) {
        this.logger.error('Error in OpenTelemetry middleware', error as Error);
        this.setError(
          error instanceof Error ? error : new Error('Unknown error')
        );
        span.end();
        next(error);
      }
    };
  }
}
