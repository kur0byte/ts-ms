// src/interface/di/interface.module.ts
import {ContainerModule, interfaces} from 'inversify';
import {MonitoringController} from './http/controllers/monitoring.controllers';

export const interfaceModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<MonitoringController>('MonitoringController')
    .to(MonitoringController)
    .inSingletonScope();
});
