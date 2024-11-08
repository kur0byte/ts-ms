import {http} from 'winston';

export const TYPES = {
  iocContainer: Symbol.for('iocContainer'),

  LoggerService: Symbol.for('LoggerService'),
  OpenTelemetryTracer: Symbol.for('OpenTelemetryTracer'),
  CloudProfiler: Symbol.for('CloudProfiler'),
  CloudErrorReporter: Symbol.for('CloudErrorReporter'),
  Server: Symbol.for('Server'),
  HTTPApplication: Symbol.for('HTTPApplication'),
  CorrelationIdMiddleware: Symbol.for('CorrelationIdMiddleware'),
  RequestLoggerMiddleware: Symbol.for('RequestLoggerMiddleware'),
  CorsMiddleware: Symbol.for('CorsMiddleware'),
  HelmetMiddleware: Symbol.for('HelmetMiddleware'),
  RateLimitMiddleware: Symbol.for('RateLimitMiddleware'),

  ConfigService: Symbol.for('ConfigService'),
  HttpConfig: Symbol.for('HttpConfig'),
  DatabaseConfig: Symbol.for('DatabaseConfig'),
  ObservabilityConfig: Symbol.for('ObservabilityConfig'),
  GcpConfig: Symbol.for('GcpConfig'),
  globalConfig: Symbol.for('globalConfig'),
  // Other types...
};
