// src/infrastructure/observability/interfaces/logger.interface.ts
// export interface ILogger {
//   info(message: string, meta?: Record<string, any>): void;
//   error(message: string, error?: Error, meta?: Record<string, any>): void;
//   warn(message: string, meta?: Record<string, any>): void;
//   debug(message: string, meta?: Record<string, any>): void;
// }

// src/infrastructure/observability/profiling/cloud-profiler.ts
import {ConfigService} from '../../config/config.service';
import * as profiler from '@google-cloud/profiler';
import {inject, injectable} from 'inversify';
// import { IProfiler } from '../interfaces/profiler.interface'
// import { ObservabilityConfig } from '../../config/observability.config';
import {TYPES} from '../../../../src/ioc/types';
// import { ConfigService } from '@config/config.service';

@injectable()
export class CloudProfiler {
  private config;
  constructor(
    @inject(TYPES.ConfigService) private readonly configService: ConfigService
    // @inject(TYPES.ConfigService) private readonly configService: ConfigService
  ) {
    this.config = this.configService.get('ObservabilityConfig');
  }

  async start(): Promise<void> {
    if (!this.config.profiling.enabled) {
      return;
    }

    await profiler.start({
      projectId: this.config.gcp.projectId,
      serviceContext: {
        service: this.config.tracing.serviceName,
        version: this.config.profiling.serviceVersion,
      },
      credentials: this.config.gcp.credentials,
    });

    console.log('Cloud Profiler started');
  }
}

// // src/infrastructure/observability/observability.module.ts
// import { ContainerModule, interfaces } from 'inversify';
// import { ILogger } from './interfaces/logger.interface';
// import { ITracer } from './interfaces/tracer.interface';
// import { IProfiler } from './interfaces/profiler.interface';
// import { IErrorReporter } from './interfaces/error-reporter.interface';
// import { WinstonLogger } from './logger/winston.logger';
// import { OpenTelemetryTracer } from './tracing/opentelemetry.tracer';
// import { CloudProfiler } from './profiling/cloud-profiler';
// import { CloudErrorReporter } from './error-reporting/error-reporter';

// export const observabilityModule = new ContainerModule((bind: interfaces.Bind) => {
//   bind<ILogger>('ILogger').to(WinstonLogger).inSingletonScope();
//   bind<ITracer>('ITracer').to(OpenTelemetryTracer).inSingletonScope();
//   bind<IProfiler>('IProfiler').to(CloudProfiler).inSingletonScope();
//   bind<IErrorReporter>('IErrorReporter').to(CloudErrorReporter).inSingletonScope();
// });

// // src/infrastructure/observability/decorators/trace.decorator.ts
// import { inject } from 'inversify';
// import { ITracer } from '../interfaces/tracer.interface';

// export function Trace(operationName?: string) {
//   return function (
//     target: any,
//     propertyKey: string,
//     descriptor: PropertyDescriptor
//   ) {
//     const originalMethod = descriptor.value;
//     const tracer = inject('ITracer')(target, 'tracer');

//     descriptor.value = async function (...args: any[]) {
//       const spanName = operationName || `${target.constructor.name}.${propertyKey}`;
//       return await tracer.startActiveSpan(spanName, async (span) => {
//         try {
//           const result = await originalMethod.apply(this, args);
//           return result;
//         } catch (error) {
//           span.recordException(error as Error);
//           throw error;
//         }
//       });
//     };

//     return descriptor;
//   };
// }

// // Example usage in a service:
// // src/application/services/user.service.ts
// @injectable()
// export class UserService {
//   constructor(
//     @inject('ILogger') private logger: ILogger,
//     @inject('IErrorReporter') private errorReporter: IErrorReporter
//   ) {}

//   @Trace('UserService.createUser')
//   async createUser(userData: UserCreateDTO): Promise<User> {
//     try {
//       this.logger.info('Creating new user', { userData });
//       // User creation logic here
//       return user;
//     } catch (error) {
//       const err = error as Error;
//       this.logger.error('Failed to create user', err, { userData });
//       await this.errorReporter.report(err, { userData });
//       throw err;
//     }
//   }
// }
