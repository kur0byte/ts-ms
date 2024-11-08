export const TYPES = {
  // Core
  Application: Symbol.for('Application'),
  LoggerService: Symbol.for('LoggerService'),

  // Middleware
  CorrelationIdMiddleware: Symbol.for('CorrelationIdMiddleware'),
  RequestLoggerMiddleware: Symbol.for('RequestLoggerMiddleware'),
  ErrorHandlingMiddleware: Symbol.for('ErrorHandlingMiddleware'),
  CorsMiddleware: Symbol.for('CorsMiddleware'),
  HelmetMiddleware: Symbol.for('HelmetMiddleware'),
  RateLimitMiddleware: Symbol.for('RateLimitMiddleware'),

  // Infrastructure
  Server: Symbol.for('Server'),
  Container: Symbol.for('Container'),
  MetricsService: Symbol.for('MetricsService'),
  HealthService: Symbol.for('HealthService'),
  TracingService: Symbol.for('TracingService'),
  // GoogleCloudTracing: Symbol.for('GoogleCloudTracing'),
  MonitoringController: Symbol.for('MonitoringController'),
  OpenTelemetryTracer: Symbol.for('OpenTelemetryTracer'),

  // Application Services
  UserService: Symbol.for('UserService'),
  AuthService: Symbol.for('AuthService'),

  // Repositories
  UserRepository: Symbol.for('UserRepository'),

  // Configuration
  ServerConfig: Symbol.for('ServerConfig'),
  DatabaseConfig: Symbol.for('DatabaseConfig'),
  TracingConfig: Symbol.for('TracingConfig'),
} as const;
