// src/domain/di/domain.module.ts
import {ContainerModule, interfaces} from 'inversify';
// import { ICustomerRepository } from '../interfaces/customer-repository.interface';
// import { CustomerRepository } from '../../infrastructure/repositories/customer-repository';

export const domainModule = new ContainerModule((bind: interfaces.Bind) => {
  // bind<ICustomerRepository>('ICustomerRepository').to(CustomerRepository).inSingletonScope();
});
