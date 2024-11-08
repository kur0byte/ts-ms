import {ErrorReporting} from '@google-cloud/error-reporting';
import {inject, injectable} from 'inversify';
import {IErrorReporter} from '../interfaces/error-reporter.interface';
import {TYPES} from '../../../../src/ioc/types';
import {ConfigService} from '../../config/config.service';
// import { observabilityConfig } from '../../config/observability.config';

@injectable()
export class CloudErrorReporter {
  private config;
  private errorReporting: ErrorReporting;

  constructor(
    @inject(TYPES.ConfigService) private readonly configService: ConfigService
  ) {
    this.config = this.configService.get('ObservabilityConfig');
    this.errorReporting = new ErrorReporting({
      projectId: this.config.gcp.projectId,
      credentials: this.config.gcp.credentials,
      serviceContext: {
        service: this.config.errorReporting.serviceName,
        version: this.config.errorReporting.serviceVersion,
      },
      logLevel: this.config.logging.logLevel,
    });
  }

  async report(error: Error, meta: Record<string, any> = {}): Promise<void> {
    if (!this.config.errorReporting.reportErrors) {
      return;
    }

    await this.errorReporting.report({
      message: error.message,
      stack: error.stack,
      ...meta,
      environment: this.config.tracing.environment,
    });
  }
}
