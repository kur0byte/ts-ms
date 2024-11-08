// // src/shared/decorators/trace.decorator.ts
// import { trace, context, SpanStatusCode } from '@opentelemetry/api';
// import { TYPES } from '../../shared/types';
// // import { ITracingService } from '../../application/ports/ITracingService';
// import { iocContainer } from '../../ioc/container';
// // import { TracingService } from '../../infrastructure/monitoring/tracing-service';
// import { OpenTelemetryTracer } from '../../infrastructure/observability/tracing/opentelemetry.tracer';

// export function Trace(name?: string) {
//     return function (
//         target: any,
//         propertyKey: string,
//         descriptor: PropertyDescriptor
//     ) {
//         const originalMethod = descriptor.value;
//         const tracingService = iocContainer.get<OpenTelemetryTracer>(TYPES.OpenTelemetryTracer);
//         const methodName = name || `${target.constructor.name}.${propertyKey}`;

//         descriptor.value = async function (...args: any[]) {
//             const ctx = tracingService.startSpan(methodName, {
//                 attributes: {
//                     'code.function': propertyKey,
//                     'code.namespace': target.constructor.name
//                 }
//             });

//             try {
//                 const result = await context.with(ctx, () =>
//                     originalMethod.apply(this, args)
//                 );
//                 return result;
//             } catch (error) {
//                 tracingService.setError(error as Error);
//                 throw error;
//             } finally {
//                 tracingService.endSpan();
//             }
//         };

//         return descriptor;
//     };
// }
