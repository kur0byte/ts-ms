// // src/infrastructure/observability/observability.module.ts
// import { ContainerModule, interfaces } from 'inversify';
// import { IProfiler } from './interfaces/profiler.interface';
// import { IErrorReporter } from './interfaces/error-reporter.interface';
// import { CloudErrorReporter } from './error-reporting/error-reporter';
// import { CloudProfiler } from './profiler/profiler';

// export const observabilityModule = new ContainerModule((bind: interfaces.Bind) => {
//   // bind<ILogger>('ILogger').to(WinstonLogger).inSingletonScope();
//   // bind<ITracer>('ITracer').to(OpenTelemetryTracer).inSingletonScope();
//   bind('IProfiler').to(CloudProfiler).inSingletonScope();
//   bind('IErrorReporter').to(CloudErrorReporter).inSingletonScope();
// });

// // src/infrastructure/observability/decorators/trace.decorator.ts
// // import { inject } from 'inversify';
// // import { ITracer } from '../interfaces/tracer.interface';

// // export function Trace(operationName?: string) {
// //   return function (
// //     target: any,
// //     propertyKey: string,
// //     descriptor: PropertyDescriptor
// //   ) {
// //     const originalMethod = descriptor.value;
// //     const tracer = inject('ITracer')(target, 'tracer');

// //     descriptor.value = async function (...args: any[]) {
// //       const spanName = operationName || `${target.constructor.name}.${propertyKey}`;
// //       return await tracer.startActiveSpan(spanName, async (span) => {
// //         try {
// //           const result = await originalMethod.apply(this, args);
// //           return result;
// //         } catch (error) {
// //           span.recordException(error as Error);
// //           throw error;
// //         }
// //       });
// //     };

// //     return descriptor;
// //   };
// // }

// // Example usage in a service:
// // src/application/services/user.service.ts
// // @injectable()
// // export class UserService {
// //   constructor(
// //     @inject('ILogger') private logger: ILogger,
// //     @inject('IErrorReporter') private errorReporter: IErrorReporter
// //   ) {}

// //   @Trace('UserService.createUser')
// //   async createUser(userData: UserCreateDTO): Promise<User> {
// //     try {
// //       this.logger.info('Creating new user', { userData });
// //       // User creation logic here
// //       return user;
// //     } catch (error) {
// //       const err = error as Error;
// //       this.logger.error('Failed to create user', err, { userData });
// //       await this.errorReporter.report(err, { userData });
// //       throw err;
// //     }
// //   }
// // }
