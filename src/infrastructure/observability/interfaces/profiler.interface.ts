// src/infrastructure/observability/interfaces/profiler.interface.ts
export interface IProfiler {
  start(): Promise<void>;
  stop(): Promise<void>;
}
