// src/infrastructure/di/infrastructure.module.ts
import {ContainerModule, interfaces} from 'inversify';
import {LoggerService} from './observability/logging/logger';
import {OpenTelemetryTracer} from './observability/tracing/opentelemetry.tracer';
import {CloudProfiler} from './observability/profiler/profiler';
import {CloudErrorReporter} from './observability/error-reporting/error-reporter';
import {Server} from './http/server';
import {HTTPApplication} from './http/HTTPBaseServer.abstract';
import {CorrelationIdMiddleware} from '../../src/infrastructure/http/middlewares/correlationId.middleware';
import {RequestLoggerMiddleware} from '../../src/infrastructure/http/middlewares/requestLogger-middleware';
import {CorsMiddleware} from '../../src/infrastructure/http/middlewares/cors.middleware';
import {HelmetMiddleware} from '../../src/infrastructure/http/middlewares/helmet.middleware';
import {RateLimitMiddleware} from '../../src/infrastructure/http/middlewares/rate-limit.middleware';
import {TYPES} from '../ioc/types';
import {ConfigService} from './config/config.service';
import {ObservabilityConfig} from './config/observability.config';
import {HttpConfig} from './config/http.config';
import {DatabaseConfig} from './config/database.config';
import {GcpConfig} from './config/gcp.config';
import {globalConfig} from './config/global.config';

export const infrastructureModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    // config
    bind<ConfigService>(TYPES.ConfigService)
      .to(ConfigService)
      .inSingletonScope();
    bind<HttpConfig>(TYPES.HttpConfig).to(HttpConfig).inSingletonScope();
    bind<DatabaseConfig>(TYPES.DatabaseConfig)
      .to(DatabaseConfig)
      .inSingletonScope();
    bind<ObservabilityConfig>(TYPES.ObservabilityConfig)
      .to(ObservabilityConfig)
      .inSingletonScope();
    bind<GcpConfig>(TYPES.GcpConfig).to(GcpConfig).inSingletonScope();
    bind<globalConfig>(TYPES.globalConfig).to(globalConfig).inSingletonScope();

    //http
    bind<Server>(TYPES.Server).to(Server).inSingletonScope();
    bind<HTTPApplication>(TYPES.HTTPApplication).to(Server).inSingletonScope();

    //middlewares
    bind<CorrelationIdMiddleware>(TYPES.CorrelationIdMiddleware)
      .to(CorrelationIdMiddleware)
      .inSingletonScope();
    bind<RequestLoggerMiddleware>(TYPES.RequestLoggerMiddleware)
      .to(RequestLoggerMiddleware)
      .inSingletonScope();
    bind<CorsMiddleware>(TYPES.CorsMiddleware)
      .to(CorsMiddleware)
      .inSingletonScope();
    bind<HelmetMiddleware>(TYPES.HelmetMiddleware)
      .to(HelmetMiddleware)
      .inSingletonScope();
    bind<RateLimitMiddleware>(TYPES.RateLimitMiddleware)
      .to(RateLimitMiddleware)
      .inSingletonScope();

    //observability
    bind<LoggerService>(TYPES.LoggerService)
      .to(LoggerService)
      .inSingletonScope();
    bind<OpenTelemetryTracer>(TYPES.OpenTelemetryTracer)
      .to(OpenTelemetryTracer)
      .inSingletonScope();
    bind(TYPES.CloudProfiler).to(CloudProfiler).inSingletonScope();
    bind(TYPES.CloudErrorReporter).to(CloudErrorReporter).inSingletonScope();
  }
);
// provide me with a types json with all the symbols

// src/shared/types.ts
