// src/infrastructure/observability/interfaces/tracer.interface.ts
export interface ITracer {
  startSpan(name: string): Span;
  getCurrentSpan(): Span | undefined;
  startActiveSpan<T>(name: string, fn: (span: Span) => Promise<T>): Promise<T>;
}

export interface Span {
  end(): void;
  setAttributes(attributes: Record<string, string | number | boolean>): void;
  recordException(error: Error): void;
}
