// src/infrastructure/monitoring/controllers/monitoring.controller.ts
import {controller, httpGet} from 'inversify-express-utils';
import {inject} from 'inversify';

// import { HealthService } from '../health.service';
// import { MetricsService } from '../metrics.service';

@controller('/monitoring')
export class MonitoringController {
  constructor() {} // @inject(TYPES.MetricsService) private metricsService: MetricsService // @inject(TYPES.HealthService) private healthService: HealthService,

  @httpGet('/health')
  public async health(): Promise<any> {
    // const health = await this.healthService.check();
    // return health;
  }

  @httpGet('/ready')
  public async ready(): Promise<any> {
    // const ready = await this.healthService.isReady();
    // return { status: ready ? 'ok' : 'not_ready' };
  }

  @httpGet('/live')
  public live(): any {
    return {status: 'ok'};
  }

  @httpGet('/metrics')
  public async metrics(): Promise<any> {
    // const metrics = await this.metricsService.getMetrics();
    // return metrics;
  }
}
