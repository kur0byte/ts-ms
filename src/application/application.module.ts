// src/application/di/application.module.ts
import {ContainerModule, interfaces} from 'inversify';
// import { CreateCustomer } from '../use-cases/create-customer';

export const applicationModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    // bind<CreateCustomer>('CreateCustomer').to(CreateCustomer).inSingletonScope();
  }
);
