// src/infrastructure/config/observability.config.ts
import {config} from 'dotenv';
// import { OBSERVABILITY_CONSTANTS } from '../../shared/constants/observability.constants';
import {injectable} from 'inversify';
import path from 'path';

// config();

@injectable()
export class ObservabilityConfig {
  public readonly gcp = {
    projectId: process.env.GCP_PROJECT_ID || 'project-id',
    credentials: process.env.GCP_CREDENTIALS
      ? JSON.parse(process.env.GCP_CREDENTIALS)
      : path.join(__dirname, '../../../gcp_iam_key_tsms.json'),
  };
  public readonly logging = {
    logLevel: process.env.LOG_LEVEL || 'info',
    serviceName: process.env.SERVICE_NAME || 'service-name',
    environment: process.env.ENVIRONMENT || 'development',
  };
  public readonly tracing = {
    serviceName: process.env.SERVICE_NAME || 'service-name',
    serviceVersion: process.env.version || '1.0.0',
    environment: process.env.ENVIRONMENT || 'development',
    samplingRatio: Number(process.env.TRACING_SAMPLING_RATIO) || 1.0,
  };
  public readonly errorReporting = {
    serviceName: process.env.SERVICE_NAME || 'service-name',
    serviceVersion: process.env.version || '1.0.0',
    reportErrors: process.env.REPORT_ERRORS !== 'false',
  };
  public readonly profiling = {
    enabled: process.env.ENABLE_PROFILING === 'true',
    serviceVersion: process.env.version || '1.0.0',
  };
}
