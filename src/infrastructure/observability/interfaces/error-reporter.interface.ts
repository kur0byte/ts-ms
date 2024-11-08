// src/infrastructure/observability/interfaces/error-reporter.interface.ts
export interface IErrorReporter {
  report(error: Error, meta?: Record<string, any>): Promise<void>;
}
