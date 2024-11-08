import {TYPES} from '../ioc/types';
import {Container, injectable} from 'inversify';
import {Server} from '../infrastructure/http/server';
import {LoggerService} from '../infrastructure/observability/logging/logger';
import {MonitoringController} from '../interface/http/controllers/monitoring.controllers';
import {CorrelationIdMiddleware} from '../../src/infrastructure/http/middlewares/correlationId.middleware';
import {RequestLoggerMiddleware} from '../../src/infrastructure/http/middlewares/requestLogger-middleware';
import {CorsMiddleware} from '../../src/infrastructure/http/middlewares/cors.middleware';
import {HelmetMiddleware} from '../../src/infrastructure/http/middlewares/helmet.middleware';
import {RateLimitMiddleware} from '../../src/infrastructure/http/middlewares/rate-limit.middleware';
// import {TracingConfig} from '../infrastructure/config/Tracing.config';
// import {ObservabilityConfig} from '../infrastructure/config/observability.config';
import {OpenTelemetryTracer} from '../infrastructure/observability/tracing/opentelemetry.tracer';

import {applicationModule} from '../application/application.module';
import {domainModule} from '../domain/domain.module';
import {infrastructureModule} from '../infrastructure/infrastructure.module';
import {interfaceModule} from '../interface/interface.module';

@injectable()
export class iocContainer {
  private static container: Container;

  public static get<T>(serviceIdentifier: symbol): T {
    return iocContainer.getContainer().get<T>(serviceIdentifier);
  }

  public static getContainer(): Container {
    if (!iocContainer.container) {
      iocContainer.container = new Container();
      this.registerDependencies(iocContainer.container);
    }

    return iocContainer.container;
  }

  public static registerDependencies(container: Container): void {
    container.bind<Container>(TYPES.iocContainer).toConstantValue(container);
    container.load(domainModule);
    container.load(applicationModule);
    container.load(infrastructureModule);
    container.load(interfaceModule);
  }

  // public static registerDependencies(container: Container): void {
  //    // Infrastructure
  //    container.bind<Container>(TYPES.Container).toConstantValue(container);
  //    container.bind<Server>(TYPES.Server).to(Server).inSingletonScope();
  //    container.bind<LoggerService>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
  //    container.bind<OpenTelemetryTracer>(TYPES.OpenTelemetryTracer).to(OpenTelemetryTracer).inSingletonScope();
  //   container.bind<TracingConfig>(TYPES.TracingConfig).to(TracingConfig).inSingletonScope();
  //   // container.bind<GoogleCloudTracing>(TYPES.GoogleCloudTracing).to(GoogleCloudTracing).inSingletonScope();
  //   //  container.bind<GoogleCloudTracing>(TYPES.GoogleCloudTracing).to(GoogleCloudTracing).inSingletonScope()
  //    // Controllers
  //    container.bind<MonitoringController>(TYPES.MonitoringController).to(MonitoringController).inSingletonScope();

  //    // Middlewares
  //    container.bind<CorrelationIdMiddleware>(TYPES.CorrelationIdMiddleware).to(CorrelationIdMiddleware).inSingletonScope();
  //    container.bind<RequestLoggerMiddleware>(TYPES.RequestLoggerMiddleware).to(RequestLoggerMiddleware).inSingletonScope();
  //    container.bind<CorsMiddleware>(TYPES.CorsMiddleware).to(CorsMiddleware).inSingletonScope();
  //    container.bind<HelmetMiddleware>(TYPES.HelmetMiddleware).to(HelmetMiddleware).inSingletonScope();
  //    container.bind<RateLimitMiddleware> (TYPES.RateLimitMiddleware).to(RateLimitMiddleware).inSingletonScope();

  //    // container.bind<IMetricsService>(TYPES.MetricsService).to(MetricsService).inSingletonScope();
  //    // container.bind<IHealthService>(TYPES.HealthService).to(HealthService).inSingletonScope();
  //    // container.bind<ITracingService>(TYPES.TracingService).to(TracingService).inSingletonScope();
  // }
}

// src/ioc/container.ts
// import {Container} from 'inversify';
// import {applicationModule} from '../application/application.module';
// import {domainModule} from '../domain/domain.module';
// import {infrastructureModule} from '../infrastructure/infrastructure.module';
// import {interfaceModule} from '../interface/interface.module';

// const container = new Container();

// // Load modules
// container.load(domainModule);
// container.load(applicationModule);
// container.load(infrastructureModule);
// container.load(interfaceModule);
